export async function checkCompleted(req, res, next) {
	console.log(req.user.isCompleted);
	if (req.user && req.user.isCompleted) return res.redirect('/');
	next();
}

export default checkCompleted;
