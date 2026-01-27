import { Router } from "express";
import { createAddressController, deleteAddressController, getAddressByIdController, getAddressesController, setDefaultAddressController, updateAddressController } from "./address.controller";

const router = Router();

router.get('/' , getAddressesController);
router.get('/:addressId' , getAddressByIdController);
router.post('/' , createAddressController);
router.patch('/:addressId' , updateAddressController);
router.delete('/:addressId' , deleteAddressController);
router.patch('/:addressId/default' , setDefaultAddressController);

export default router;