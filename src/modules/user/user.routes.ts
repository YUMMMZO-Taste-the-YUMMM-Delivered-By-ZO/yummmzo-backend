import { Router } from "express";
import { changePasswordController, deleteAccountController, getProfileController, updateProfileController, uploadAvatarController } from "./user.controller";

const router = Router();

router.get('/profile' , getProfileController);
router.patch('/profile' , updateProfileController);
router.post('/change-password' , changePasswordController);
router.post('/avatar' , uploadAvatarController);
router.delete('/account' , deleteAccountController);

export default router;