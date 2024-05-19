import Users from "../models/User.js";

const checkRole = (role) => {
	return async function (req, res, next) {
		const user = await Users.findOne({ where: { email: req.user.email } });
		let roles = await user.getRoles();
		roles = roles.map((role) => {
			return role.dataValues.role.toLowerCase();
		});
		console.log(roles);
		if (user && roles.includes(role.toLowerCase())) {
			next();
		} else {
			res.status(403).send('Unauthorized');
		}
	};
};

export default checkRole;
