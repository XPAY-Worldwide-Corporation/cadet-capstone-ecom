import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { BookmarksService } from './bookmarks.service';
import { CreateBookmarkDto } from './dto/create-bookmark.dto';

@Controller('bookmarks')
export class BookmarksController {
  constructor(private readonly bookmarksService: BookmarksService
) {}

  @Get()
  getCustomerBookmark() {}

  @Post(':bookmark_id')
  addItemToBookmark(
    @Body() createBookmarkDto: CreateBookmarkDto,
    @Param('bookmark_id') bookmarkId : string
  ) {
  }

  @Delete(':bookmark_id/items/:bookmark_item_id')
  deleteItemFromBookmark(    
    @Param('bookmark_id') bookmarkId: string, 
    @Param('bookmark_item_id') bookmark_item_id: string
  ) {
  }
}
