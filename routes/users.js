const router = require("express").Router();
const { getUserInfo, getUsers, updateUser } = require("../controllers/users");
const { validateUpdateUser } = require("../middlewares/validation");

// GET /users — возвращает всех пользователей
router.get("/", getUsers);

// GET /users/me — возвращает пользователя
router.get("/me", getUserInfo);

router.patch("/me", validateUpdateUser, updateUser);

module.exports = router;
