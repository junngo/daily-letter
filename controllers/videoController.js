import Video from "../models/Video";
import routes from "../routes";

export const home = async (req, res) => {
    try {
        const videos = await Video.find({}).sort( { _id: -1 });
        res.render("home", { pageTitle: "Home", videos });
    } catch(error) {
        console.log(error);
        res.render("home", { pageTitle: "Home", videos: []})
    }
};

export const search = async (req, res) => {
    // const searchingBy = req.query.term;
    const {
        query: { term: searchingBy }
    } = req;
    
    let videos = [];

    try {
        videos = await Video.find({
            title: { $regex: searchingBy, $options: "i" }
        });
    } catch(error) {
        console.log(error);
    }

    // res.render("search", {pageTitle: "Search", searchingBy: "searchingBy"});
    res.render("search", { pageTitle: "Search", searchingBy, videos });
};

export const getUpload = (req, res) => res.render("upload", {pageTitle: "Upload"});
export const postUpload = async (req, res) => {
    const {
        body: { title, description },
        file: { path }
    } = req;
    // console.log(req.body, req.file);

    const newVideo = await Video.create({
        fileUrl: path,
        title,
        description,
        creator: req.user.id
    });
    req.user.videos.push(newVideo.id);
    req.user.save();
    
    res.redirect(routes.videoDetail(newVideo.id));
};

export const videoDetail = async (req, res) => {
    const {
        params: { id }
    } = req;
    // routes -> const VIDEO_DETAIL = "/:id";
    // console.log(req.params); 
    
    try {
        const video = await Video.findById(id).populate("creator");
        // console.log(video);
        res.render("videoDetail", { pageTitle: "Video Detail", video });
    } catch (error) {
        res.redirect(routes.home);
    }
}

export const getEditVideo = async (req, res) => {
    const {
        params: { id } 
    } = req;

    try {
        const video = await Video.findById(id);
        res.render("editVideo", { pageTitle: video.title, video });
    } catch (error) {
        res.redirect(routes.home);
    }
};

export const postEditVideo = async (req, res) => {
    const {
        params: { id },
        body: { title, description }
    } = req;
    console.log(req.params, req.body);
    try {
        await Video.findOneAndUpdate({ _id: id }, { title, description });
        res.redirect(routes.videoDetail(id));
    } catch (error) {
        res.redirect(routes.home);
    }
};

export const deleteVideo = async (req, res) => {
    const {
        params: { id }
    } = req;
    try {
        await Video.findOneAndDelete({ _id: id })
    } catch(error){}
    res.redirect(routes.home);
};