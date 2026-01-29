import { Router } from "express";
import { createAddressController, deleteAddressController, getAddressByIdController, getAddressesController, setDefaultAddressController, updateAddressController } from "./address.controller";

const router = Router();

router.get('/:userId' , getAddressesController);
router.get('/:userId/:addressId' , getAddressByIdController);
router.post('/:userId' , createAddressController);
router.patch('/:userId/:addressId' , updateAddressController);
router.patch('/:userId/:addressId/default' , setDefaultAddressController);
router.delete('/:userId/:addressId' , deleteAddressController);

export default router;