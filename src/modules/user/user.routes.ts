import { Router } from "express";
import { changePasswordController, deleteAccountController, getProfileController, updateProfileNameController, uploadAvatarController } from "./user.controller";

const router = Router();

router.get('/profile/:userId' , getProfileController);
router.patch('/profile/:userId' , updateProfileNameController);
router.patch('/avatar/:userId' , uploadAvatarController);
router.patch('/change-password/:userId' , changePasswordController);
router.delete('/account/:userId' , deleteAccountController);

export default router;