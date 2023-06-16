// libs
import helmet from "helmet";
import cors from "cors";
import express from "express";
import morgan from "morgan";

export const registerGlobalMiddlewares = (app) => {
  app.use(helmet());
  app.use(morgan("dev"));
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());
  app.use(cors());
};
