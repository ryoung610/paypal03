import lllsunglasses from './lllsunglasses.jpg';
import orangesunglasses from './orangesunglasses.jpeg';
import blacksunglasses from './blacksunglasses.jpeg';
//import logo from './bitcoinimage.jpeg';
import logo from './blacksunglasses.jpeg';
import search_icon from './search_icon.png';
import profile_icon from './profile_icon.jpg';
import shop_cart from './shop_cart.png';
import shop_cart01 from './shop_cart01.png';
import menu_icon from './menu_icon.png';
import dropdown_icon from './dropdown_icon.png';
import bitcoinimage from './bitcoinimage.jpeg';

export const assets = {
  logo,
  lllsunglasses,
  orangesunglasses,
  blacksunglasses,
  search_icon,
  profile_icon,
  shop_cart01,
  menu_icon,
  dropdown_icon,
  bitcoinimage
};

export const products = [
{
  _id:"aaa",
  name: "LL&L Sunglasses",
 description: "Light-weight Sunglasses for SummerTime views and vibes whiles watching your favorite podcast",
 price: 39.99,
 image: [lllsunglasses],
 catagory: "uni-sex",
},
{
  _id:"bbb",
  name: "Black Blue-toothe Sunglasses",
 description: "Black Sunglasses bluetoothe enabled for SummerTime sounds, views, and vibes while watching your favorite podcast",
 price: 59.99,
 image: [blacksunglasses],
 catagory: "uni-sex",
subCatagory: "bluetooth sound enabled"
},
{
  _id:"ccc",
  name: "Orange Sunglasses",
 description: "Orange Sunglasses for SummerTime views and vibes whiles watching your favorite podcast",
 price: 99.99,
 image: [orangesunglasses],
 catagory: "uni-sex",
}
]

