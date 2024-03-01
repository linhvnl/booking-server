// ---------------------------
// HELPER FUNCTION
module.exports = async function (res, perPage, page, MODEL, docName) {
  // logic phân trang
  const skip = (page - 1) * perPage;
  const limit = perPage;

  // fetch docs
  try {
    // Số lượng tất cả Hotels của hệ thống
    const totalDocs = await MODEL.estimatedDocumentCount();

    // fetch docs
    let docs;
    docName === "transactions"
      ? (docs = await MODEL.find()
          .populate("hotel", "name")
          .sort({ dateEnd: -1 })
          .skip(skip)
          .limit(limit))
      : (docs = await MODEL.find().sort({ title: 1 }).skip(skip).limit(limit));

    // return response error
    if (!docs) return res.status(400).json({ message: "Error" });

    // return response
    return res.status(200).json({
      totalDocs,
      perPage,
      totalPages: Math.ceil(totalDocs / perPage),
      page,
      numDocs: docs.length,
      [docName]: docs,
    });

    // ------ ERROR -------
  } catch (err) {
    console.log(err);
  }
};
