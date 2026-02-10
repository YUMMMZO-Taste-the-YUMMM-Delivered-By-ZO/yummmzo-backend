import { Router } from "express";
import { createAddressController, deleteAddressController, getAddressByIdController, getAddressesController, setDefaultAddressController, updateAddressController } from "./address.controller";
import { authorize } from "@/middlewares/auth.middleware";

const router = Router();

router.get('/' , authorize('CUSTOMER') , getAddressesController);
router.get('/:addressId' , authorize('CUSTOMER') , getAddressByIdController);
router.post('/' , authorize('CUSTOMER') , createAddressController);
router.patch('/:addressId' , authorize('CUSTOMER') , updateAddressController);
router.patch('/:addressId/default' , authorize('CUSTOMER'),  setDefaultAddressController);
router.delete('/:addressId' , authorize('CUSTOMER'),  deleteAddressController);

export default router;