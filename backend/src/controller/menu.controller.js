import Menu from '../models/menu.models.js';
import ApiResponse from '../utils/ApiResponse.js';
import asyncHandler from '../utils/asyncHandler.js';
import { requiredField } from '../utils/helper.js';

const addNewMenu = asyncHandler(async(req,res)=>{

  const { itemName, itemDescription, itemImage, priceOfItem, itemCategory } = req.body

    requiredField([itemDescription, itemName, priceOfItem, itemCategory])

    console.log({ itemName, itemDescription, itemImage, priceOfItem, itemCategory })


    const menu = await Menu.create({
        itemsName : itemName,
        itemDescription : itemDescription,
        itemImage : itemImage,
        itemCategory : itemCategory,
        priceOfItem : priceOfItem,
    })

    return res.status(201).
    json(new ApiResponse(201, {},`${menu.itemsName} in menu add successfully` ))

})

const fetchFullMenuMenu = asyncHandler(async(req,res)=>{

  const items = await Menu.find()

  return res.status(200).json(new ApiResponse(200, items ,"all items fetch successfully"))
})

const deleteItem = asyncHandler(async(req,res)=>{

  const  {itemId} = req.params

  await Menu.findByIdAndDelete(itemId)

  return res.status(204).json(new ApiResponse(204, {}, "Item delete sucessfully"))
})

const updateItem = asyncHandler(async(req,res)=>{

  const { itemId } = req.params

  await Menu.findByIdAndUpdate(itemId, {
    $set :  req.body
  }, { save : false })

    return res.status(201).json(new ApiResponse(201, {}, "item update successfully"))
})




export {
    addNewMenu, updateItem, deleteItem, fetchFullMenuMenu
};
