var content = {
	"en": {
		"start-project-btn": "Start Project",
		"artistText": "Artist",
		"songText": "Song's name",
		"welcomeText": "Welcome to mytranshelper, please login first and then click the start project button so that you can start your lyrics translation project.",
		"welcomeTextHeader": "Get Start",
		"welcomeTextDrawer": "Welcome",
		"welcomeTextDrawerLogin": "Welcome back,",
		"dialogTitleText": "Please enter your project info",
		"uploadBtn": "Upload lyrics",
		"title": "Home page",
		"logout-btn": "Log out",
		"login-btn": "Log in",
		"loadProjectText": "加载项目",
		"projectTag": "Projects",
		"loadProject": "Load Project",
		"editing-page-title" : "Lyrics Translation",
		"translationProject" : "Translation Project",
		"original-text" : "Original",
		"translation-text" : "Translation"
	},

	"zh": {
		"start-project-btn": "开始项目",
		"artistText": "歌手",
		"songText": "歌名",
		"welcomeText": "欢迎来到歌词翻译网站，请先登录，之后轻点下方的开始项目按钮，便可以轻松创建属于你的歌词翻译项目。",
		"welcomeTextHeader": "开始使用",
		"welcomeTextDrawer": "欢迎",
		"welcomeTextDrawerLogin": "欢迎回来,",
		"dialogTitleText": "请输入你的项目信息",
		"uploadBtn": "上传歌词",
		"title": "主页面",
		"logout-btn": "登出",
		"login-btn": "登入",
		"loadProjectText": "加载项目",
		"projectTag": "全部项目",
		"loadProject": "读取项目",
		"translationProject" : "翻译工程",
		"editing-page-title" : "歌词翻译",
		"original-text" : "原文",
		"translation-text" : "译文"

	}
};



$(".lang").each(function (index) {
	var id = this.id;
	$(this).text(content[languageCode][id])

});
