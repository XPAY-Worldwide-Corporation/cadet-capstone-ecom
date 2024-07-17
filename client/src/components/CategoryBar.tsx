import React from "react";

export default function CategoryBar() {
  const classCatBtn = "bg-black text-white px-[2rem] py-2";

  return (
    <ul className="flex gap-[1rem] overflow-auto">
      <li className={classCatBtn}>
        <button>Mens Products</button>
      </li>
      <li className={classCatBtn}>
        <button>Womens Products</button>
      </li>
      <li className={classCatBtn}>
        <button>Jewelry</button>
      </li>
      <li className={classCatBtn}>
        <button>Electronics</button>
      </li>
      <li className={classCatBtn}>
        <button>Kitchen Utensils</button>
      </li>
      <li className={classCatBtn}>
        <button>Books</button>
      </li>
    </ul>
  );
}
