// Wrapper cho async controller: tự chuyển lỗi sang error middleware của Express qua next().
const catchAsync = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = catchAsync;
