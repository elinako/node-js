const Joi = require("joi");
const UserModel = require("./user.model");
const {
  Types: { ObjectId },
} = require("mongoose");
const bcryptjs = require("bcrypt");
const userModel = require("./user.model");
const jwt = require("jsonwebtoken");
const { UnauthorizedError } = require("../helper/errors.constructors");
const _ = require("lodash");

class UserController {
  constructor() {
    this.costFactor = 4;
  }

  get createUser() {
    return this._createUser.bind(this);
  }

  get getCurrentUser() {
    return this._getCurrentUser.bind(this);
  }

  async _createUser(req, res, next) {
    try {
      const { email, password } = req.body;
      const userAlreadyExist = await UserModel.findUserByEmail(email);

      if (userAlreadyExist) {
        return res.status(409).send("Email in use");
      }

      const passwordHash = await bcryptjs.hash(password, this.costFactor);
      const user = await UserModel.create({
        email,
        password: passwordHash,
      });

      return res.status(201).json({
        email: user.email,
        subscription: user.subscription,
      });
    } catch (err) {
      next(err);
    }
  }

  async signIn(req, res, next) {
    try {
      const { email, password } = req.body;

      const user = await UserModel.findUserByEmail(email);

      if (!user) {
        return res.status(401).send("Email or password is wrong");
      }

      const isPasswordValid = await bcryptjs.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).send("Email or password is wrong");
      }

      const token = await jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: 2 * 24 * 60 * 60, // 2 days
      });

      await UserModel.updateToken(user._id, token);

      return res.status(200).json({ token, email });
    } catch (err) {
      next(err);
    }
  }

  async logout(req, res, next) {
    try {
      const user = req.user;
      if (!user._id) {
        throw new UnauthorizedError("User not authorized");
      }
      await UserModel.updateToken(user._id, null);

      return res.status(204).send();
    } catch (err) {
      next(err);
    }
  }

  async authorize(req, res, next) {
    try {
      const authorizationHeader = req.get("Authorization");
      const token = authorizationHeader.replace("Bearer ", "");

      let userId;
      try {
        userId = await jwt.verify(token, process.env.JWT_SECRET).id;
      } catch (err) {
        next(new UnauthorizedError("Not authorized"));
      }

      const user = await UserModel.findById(userId);
      if (!user || user.token !== token) {
        throw new UnauthorizedError();
      }

      req.user = user;
      req.token = token;

      next();
    } catch (err) {
      next(err);
    }
  }

  async _getCurrentUser(req, res, next) {
    try {
      return res
        .status(200)
        .json({ email: req.user.email, subscription: req.user.subscription });
    } catch (err) {
      next(err);
    }
  }

  prepareUsersResponse(users) {
    return users.map((user) => _omit(user, "password", "token"));
  }

  validateCreateUser(req, res, next) {
    const validationRules = Joi.object().keys({
      email: Joi.string().required(),
      password: Joi.string().required(),
    });
    const validationResult = validationRules.validate(req.body);
    if (validationResult.error) {
      return res.status(400).send({ message: "missing required field" });
    }
    next();
  }

  validateSignIn(req, res, next) {
    const validationRules = Joi.object({
      email: Joi.string().required(),
      password: Joi.string().required(),
    });

    const validationResult = validationRules.validate(req.body);
    if (validationResult.error) {
      return res.status(400).send({ message: "missing fields" });
    }
    next();
  }

  validateId(req, res, next) {
    const id = req.params.id;

    if (!ObjectId.isValid(id)) {
      return res.status(400).send();
    }
    next();
  }
}

module.exports = new UserController();
