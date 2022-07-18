import userRoute from "../modules/user/user.route";

// !TODO: Create Type of ROUTES array
const ROUTES = [
  {
    route: userRoute,
    options: {
      prefix: "/api/users",
    },
  },
];

export default ROUTES;
