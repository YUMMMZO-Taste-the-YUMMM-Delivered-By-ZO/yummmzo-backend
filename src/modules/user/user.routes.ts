import { Router } from "express";
import { changePasswordController, deleteAccountController, getProfileController, updateProfileNameController, uploadAvatarController } from "./user.controller";
import { authorize } from "@/middlewares/auth.middleware";

const router = Router();

router.get('/profile' , authorize('CUSTOMER') ,  getProfileController);
router.patch('/profile' , authorize('CUSTOMER') , updateProfileNameController);
router.patch('/avatar' , authorize('CUSTOMER') , uploadAvatarController);
router.patch('/change-password' , authorize('CUSTOMER') , changePasswordController);
router.delete('/account' , authorize('CUSTOMER') , deleteAccountController);

export default router;