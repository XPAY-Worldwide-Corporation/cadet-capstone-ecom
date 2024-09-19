import { Test, TestingModule } from "@nestjs/testing";
import { CommentsController } from "./comments.controller";
import { CommentsService } from "./comments.service";
import { JwtService } from "@nestjs/jwt";
import { Reflector } from "@nestjs/core";
import { CreateCommentDto } from "./dto/create-comment.dto";
import { UpdateCommentDto } from "./dto/update-comment.dto";
import { NotFoundException } from "@nestjs/common";
import { multipleImages, responseHandler } from "src/utils";
import { ROLE } from "src/constants";
import { JwtAuthGuard } from "src/middleware";

jest.mock("src/utils", () => ({
  multipleImages: jest.fn().mockResolvedValue([
    {
      public_id: "image_id_1",
      url: "http://example.com/image1.jpg",
      originalname: "image1.jpg",
    },
  ]),
  responseHandler: jest.fn(),
}));

describe("CommentsController", () => {
  let controller: CommentsController;
  const mockService = {
    comments: [],
    getAll: jest.fn().mockResolvedValue([]),
    getById: jest.fn().mockImplementation((id: number) => {
      const comment = mockService.comments.find((c) => c.id === id);
      if (!comment) throw new NotFoundException("Comment not found");
      return Promise.resolve(comment);
    }),
    add: jest.fn().mockImplementation((dto: CreateCommentDto) => {
      const newComment = { id: mockService.comments.length + 1, ...dto };
      mockService.comments.push(newComment);
      return Promise.resolve(newComment);
    }),
    update: jest
      .fn()
      .mockImplementation((id: number, dto: UpdateCommentDto) => {
        const index = mockService.comments.findIndex((c) => c.id === id);
        if (index === -1) throw new NotFoundException("Comment not found");
        mockService.comments[index] = {
          ...mockService.comments[index],
          ...dto,
        };
        return Promise.resolve(mockService.comments[index]);
      }),
    deleteById: jest.fn().mockImplementation((id: number) => {
      const index = mockService.comments.findIndex((c) => c.id === id);
      if (index === -1) throw new NotFoundException("Comment not found");
      const deletedComment = mockService.comments.splice(index, 1)[0];
      return Promise.resolve(deletedComment);
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CommentsController],
      providers: [
        { provide: CommentsService, useValue: mockService },
        {
          provide: JwtService,
          useValue: {
            verify: jest.fn().mockReturnValue({ role: ROLE.CUSTOMER }),
          },
        },
        { provide: Reflector, useValue: {} },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({
        canActivate: jest.fn((context) => {
          const request = context.switchToHttp().getRequest();
          request.user = { role: ROLE.CUSTOMER };
          return true;
        }),
      })
      .compile();

    controller = module.get<CommentsController>(CommentsController);
    mockService.comments = [];
    (multipleImages as jest.Mock).mockClear();
    (responseHandler as jest.Mock).mockClear();
  });

  const createCommentDto: CreateCommentDto = {
    ratings: 4,
    description: "This is a comment description.",
    image: [
      {
        public_id: "image_id_1",
        url: "http://example.com/image1.jpg",
        originalname: "image1.jpg",
      },
    ],
    transactionId: 123,
  };

  const updateCommentDto: UpdateCommentDto = {
    ratings: 5,
    description: "Updated description.",
    image: [
      {
        public_id: "image_id_2",
        url: "http://example.com/image2.jpg",
        originalname: "image2.jpg",
      },
    ],
    transactionId: 456,
  };

  const mockComment = {
    id: 1,
    ratings: 4,
    description: "This is a comment description.",
    image: [
      {
        public_id: "image_id_1",
        url: "http://example.com/image1.jpg",
        originalname: "image1.jpg",
      },
    ],
    transactionId: 123,
  };

  const mockResponse = (data: any, message: string) => ({
    data,
    message,
    meta: {},
    status: true,
  });

  it("should create a Comment", async () => {
    (responseHandler as jest.Mock).mockReturnValue(
      mockResponse(mockComment, "Comment created successfully"),
    );

    const files = [
      {
        originalname: "image1.jpg",
        mimetype: "image/jpeg",
        size: 1234,
      } as Express.Multer.File,
    ];

    const result = await controller.create(createCommentDto, files);
    expect(result).toEqual(
      mockResponse(mockComment, "Comment created successfully"),
    );
    expect(result).toMatchSnapshot();
  });

  it("should return all comments", async () => {
    mockService.comments.push(mockComment);

    (responseHandler as jest.Mock).mockReturnValue(
      mockResponse(mockService.comments, "All comments retrieved successfully"),
    );

    const result = await controller.findAll();
    expect(result).toEqual(
      mockResponse(mockService.comments, "All comments retrieved successfully"),
    );
    expect(result).toMatchSnapshot();
  });

  it("should return a single comment", async () => {
    mockService.comments.push(mockComment);

    (responseHandler as jest.Mock).mockReturnValue(
      mockResponse(mockComment, "Comment retrieved successfully"),
    );

    const result = await controller.findOne(1);
    expect(result).toEqual(
      mockResponse(mockComment, "Comment retrieved successfully"),
    );
    expect(result).toMatchSnapshot();
  });

  it("should update a Comment's details", async () => {
    await controller.create(createCommentDto, []);

    (responseHandler as jest.Mock).mockReturnValue(
      mockResponse(
        {
          ...mockComment,
          ...updateCommentDto,
        },
        "Comment updated successfully",
      ),
    );

    const files = [
      {
        originalname: "image2.jpg",
        mimetype: "image/jpeg",
        size: 1234,
      } as Express.Multer.File,
    ];

    const result = await controller.update(1, updateCommentDto, files);
    expect(result).toEqual(
      mockResponse(
        {
          ...mockComment,
          ...updateCommentDto,
        },
        "Comment updated successfully",
      ),
    );
    expect(result).toMatchSnapshot();
  });

  it("should delete a Comment", async () => {
    await controller.create(createCommentDto, []);

    (responseHandler as jest.Mock).mockReturnValue(
      mockResponse(mockComment, "Comment deleted successfully"),
    );

    const result = await controller.remove(1);
    expect(result).toEqual(
      mockResponse(mockComment, "Comment deleted successfully"),
    );
    expect(result).toMatchSnapshot();
  });
});
