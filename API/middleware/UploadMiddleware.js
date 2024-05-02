import multer from "multer";
import path from "path";
import { randomBytes } from "crypto";

const UserAvatarsFolder = "UserAvatars";
const CompanyLogosFolder = "CompanyLogos";
const EventLogosFolder = "EventLogos";
const EventCoversFolder = "EventCovers";

const avatarStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, `./storage/${UserAvatarsFolder}/`);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const uniqueSuffix = Date.now() + "-" + randomBytes(4).toString('hex');;
    cb(null, uniqueSuffix + ext);
  },
});

const LogoStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, `./storage/${CompanyLogosFolder}/`);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const uniqueSuffix = Date.now() + "-" + randomBytes(4).toString('hex');;
    cb(null, uniqueSuffix + ext);
  }
});

const EventLogoStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, `./storage/${EventLogosFolder}/`);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const uniqueSuffix = Date.now() + "-" + randomBytes(4).toString('hex');;
    cb(null, uniqueSuffix + ext);
  }
});

const EventCoverStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, `./storage/${EventCoversFolder}/`);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const uniqueSuffix = Date.now() + "-" + randomBytes(4).toString('hex');;
    cb(null, uniqueSuffix + ext);
  }
});

const uploadAvatar = multer({ storage: avatarStorage }).single('avatar');
const uploadLogo = multer({ storage: LogoStorage }).single('logo');
const uploadEventLogo = multer({ storage: EventLogoStorage }).single('eventLogo');
const uploadEventCover = multer({ storage: EventCoverStorage }).single('eventCover');

export { uploadAvatar, uploadLogo, uploadEventLogo, uploadEventCover, EventLogosFolder, EventCoversFolder, };