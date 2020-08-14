import path from "path";
import CryptoJS from "crypto-js";
import fs from "fs-extra";
import { v4 as uuidv4 } from "uuid";
import pkg from "../../../package.json";
const electron = require("electron");

const FLAG_TEXT = "PASSWORDER_FLAG";
const DATA_FOLDER = "PASSWORDER";

export const openInBrowser = (url) => {
  electron.shell.openExternal(url);
};

export const encrypt = (originalText, key) => {
  return CryptoJS.AES.encrypt(originalText, key).toString();
};

export const decrypt = (cipherText, key) => {
  const bytes = CryptoJS.AES.decrypt(cipherText, key);
  return bytes.toString(CryptoJS.enc.Utf8);
};

export const getAppPath = () => {
  const documentPath = electron.remote.app.getPath("documents");
  const dataPath = `${documentPath}/${DATA_FOLDER}`;
  if (!isDir(dataPath)) {
    fs.ensureDir(dataPath);
  }
  return dataPath;
};

export const isDir = (p) => {
  try {
    const stat = fs.lstatSync(p);
    return stat.isDirectory();
  } catch (e) {
    return false;
  }
};

export const isFile = (p) => {
  try {
    const stat = fs.lstatSync(p);
    return stat.isFile();
  } catch (e) {
    return false;
  }
};

export const validKey = async (key) => {
  const config = await readConfig();
  const flag = decrypt(config.flag, key);
  return flag === FLAG_TEXT;
};

export const readConfig = async () => {
  const appPath = getAppPath();
  return fs.readJson(path.join(appPath, "config.json"));
};

export const parseAccounts = async (key) => {
  const config = await readConfig();
  const str = decrypt(config.accounts, key);
  return JSON.parse(str);
};

export const initConfig = async (key) => {
  const appPath = getAppPath();
  const configPath = path.join(appPath, "config.json");
  if (isFile(configPath)) {
    return false;
  }
  const defaultAccounts = [
    {
      uuid: uuidv4(),
      name: "测试账号",
      icon: "",
      account: "hello_passworder",
      password: "12345678",
      desc: "这是一个测试账号, 您可以随时删除",
    },
  ];
  const documentPath = electron.remote.app.getPath("documents");
  const config = {
    appName: pkg.name,
    appVersion: pkg.version,
    dataPath: documentPath,
    theme: "light",
    flag: encrypt(FLAG_TEXT, key),
    accounts: encrypt(JSON.stringify(defaultAccounts), key),
  };
  await fs.writeJson(path.join(appPath, "config.json"), config);
  return true;
};

export const isInitialize = () => {
  const appPath = getAppPath();
  const configPath = path.join(appPath, "config.json");
  return isFile(configPath);
};

export const addAccount = async (account, key) => {
  const appPath = getAppPath();
  const configPath = path.join(appPath, "config.json");
  const config = await fs.readJson(configPath);
  const accounts = JSON.parse(decrypt(config.accounts, key));
  config.accounts = encrypt(JSON.stringify([account, ...accounts]), key);
  await fs.writeJson(configPath, config);
};

export const removeAccount = async (uuid, key) => {
  const appPath = getAppPath();
  const configPath = path.join(appPath, "config.json");
  const config = await fs.readJson(configPath);
  const accounts = JSON.parse(decrypt(config.accounts, key));
  const newAccounts = accounts.filter((item) => item.uuid !== uuid);
  config.accounts = encrypt(JSON.stringify(newAccounts), key);
  await fs.writeJson(configPath, config);
};

export const setTheme = async (theme) => {
  const appPath = getAppPath();
  const configPath = path.join(appPath, "config.json");
  const config = await readConfig();
  config.theme = theme;
  await fs.writeJson(configPath, config);
};
