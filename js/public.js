let publc_Obj = {

	islogin: function() {

		if(!localStorage.getItem("token")) {

			$('#usercenter').remove()

		} else {

			$('#login').remove()

			$('.index_btn,.index_btn2').remove()

			$("#ljdl").hide()

			var userData = JSON.parse(localStorage.getItem("usarData"))

			console.log(userData)

			$("#userid").html(userData.identifierId)

			if(userData.type == 1) {

				$("#usercenterlink").attr("href", "UserCenter-mine.html")

				$("#usercenterlink").html("个人中心")

			}

			if(userData.type == 2) {

				$("#usercenterlink").attr("href", "CkCenter-mine.html")

				$("#usercenterlink").html("创客中心")

			}

			if(userData.type == 3) {

				$("#usercenterlink").attr("href", "ShopCenter-mine.html")

				$("#usercenterlink").html("店铺中心")

			}

		}

	},

	//获取新id
	getCKuser: function() {
		$.ajax({
			type: "post",
			url: Work_Config.InterfaceDomain + "/user/getCKuser",
			async: true,
			data: {
				token: localStorage.getItem("token")
			},
			success: function(data) {
				if(data.code == 0) {
					var newid = data.data;
					$("#AddNewck").attr("name", data.data)
					if(newid.charAt(newid.length - 1) <= 5) {
						$("#newid").html(data.data)
						
					} else {
						$("#addCK").remove();
					}

				}

			},
			error: function() {

			}
		});
	},
	message: function(message) {

		$("body").append("<div class=\"tpsbox_bg\" style=\"display: block\" id=\"mesaage\">" +

			"<div class=\"tpsbox\" style=\"display: block;\">" +

			"<div class=\"bar\"><span>温馨提示</span></div>" +

			"<div style=\"padding: 80px 20px 40px 20px\">" +

			"<P style=\"text-align: center;\">" + message + "</P>" +

			"</div>" +

			"</div>" +

			"</div>");

		setTimeout(function() {

			$("#mesaage").fadeOut()

			$("#mesaage").remove()

		}, 1000)

	},
	//取货
	PickUpgoods: function(id, orderState, event) {
		if(orderState == 2) {
			var message = "您确定取货了吗？"
		}
		if(orderState == 3) {
			var message = "您确定已经取货了吗？"
		}
		console.log(event)
		bootbox.confirm({
			message: message,
			buttons: {
				confirm: {
					label: '确定 ',
					className: 'btn-danger'
				},
				cancel: {
					label: '取消',
					className: 'btn-info'
				}
			},
			callback: function(result) {
				if(result) {
					$.ajax({

						type: "post",

						url: Work_Config.InterfaceDomain + "/order/updateOrderState",

						async: true,

						data: {

							token: localStorage.getItem("token"),

							id: id,

							orderState: orderState

						},

						success: function(data) {
							publc_Obj.message(data.message)
							$("#" + id + "").parent().parent().remove()

						},

						error: function() {

						}

					});
				}

			}
		});

	},
	//转账

	sendmoney: function(currency) {

		if(!$("#identiflerId").val()) {

			bootbox.alert("请输入转入ID")

			return

		}

		if(!$("#money").val()) {

			bootbox.alert("转账金额")

			return

		}

		$.ajax({

			type: "post",

			url: Work_Config.InterfaceDomain + "/transfer/transferForBounsAndCoupon",

			async: true,

			data: {

				token: localStorage.getItem("token"),

				money: $("#money").val(),

				currency: currency,

				identiflerId: $("#identiflerId").val()

			},

			success: function(data) {

				if(data.code == 0) {

					bootbox.alert(data.message)

				} else {

					bootbox.alert(data.message)

				}

			},

			error: function() {

			}

		});

	},

	//产品列表

	prdlist: function(pageNo, id, prdkey) {

		console.log(id)

		$(".prdlist ul").html("")

		$(".page ul").html("")

		$(".loadingbox").show();

		$(this).addClass("active").siblings().removeClass("active")

		//		var id = $(this).attr("id")

		$.ajax({

			type: "post",

			url: Work_Config.InterfaceDomain + "/product/getProductListByCategoryId",

			async: true,

			data: {

				token: localStorage.getItem("token"),

				pageNo: pageNo,

				pageSize: Work_Config.pageSize,

				productCategoryId: id

			},

			success: function(data) {

				if(data.code == 0) {

					var html = ''

					let keywords = prdkey

					let newkeywords = encodeURI(encodeURI(keywords));

					for(var i = 0; i < data.data.content.length; i++) {

						html += "<li>" +

							"<a href=\"product.html?id=" + data.data.content[i].id + "&name=" + newkeywords + "&productCategoryId=" + id + "\"></a>" +

							"<div class=\"prdpic\">" +

							"<img src=\"" + data.data.content[i].albumPics1insid + "\" />" +

							"</div>" +

							"<h2 class=\"prdtitle\">" + data.data.content[i].name + "</h2>" +

							"<P class=\"guige\"><span>" + data.data.content[i].price + "积分</span><span>" + data.data.content[i].promotionPrice + "对货券积分</span></P>" +

							"<p class=\"prdmoney\">" + data.data.content[i].price + " 元</p>" +

							"</li>"

					}

					setTimeout(function() {

						$(".prdlist .loadingbox").hide();

						$(".prdlist ul").append(html)

					}, 500)

					var page = ""

					for(var j = 1; j <= data.data.totalPages; j++) {

						if(pageNo == j) {

							page += "<li class='active'>" + j + "</li>"

						} else {

							page += "<li>" + j + "</li>"

						}

						//						page += "<li>" + j + "</li>"

					}

					$(".page ul").append(page)

				}

			},

			error: function() {

			}

		});

	},

	//搜索产品列表

	searchPrdlist: function(pageNo, keywords) {

		$(".prdlist ul").html("")

		$(".page ul").html("")

		$(".loadingbox").show();

		$(this).addClass("active").siblings().removeClass("active")

		//		var id = $(this).attr("id")

		$.ajax({

			type: "post",

			url: Work_Config.InterfaceDomain + "/product/getProductListByName",

			async: true,

			data: {

				token: localStorage.getItem("token"),

				pageNo: pageNo,

				pageSize: Work_Config.SearchpageSize,

				keyword: keywords,

			},

			success: function(data) {

				let newkeywords = encodeURI(encodeURI(keywords));

				if(data.code == 0) {

					var html = ''

					for(var i = 0; i < data.data.content.length; i++) {

						html += "<li>" +

							"<a href=\"product.html?id=" + data.data.content[i].id + "&name=" + newkeywords + "\"></a>" +

							"<div class=\"prdpic\">" +

							"<img src=\"" + data.data.content[i].albumPics1insid + "\" />" +

							"</div>" +

							"<h2 class=\"prdtitle\">" + data.data.content[i].name + "</h2>" +

							"<P class=\"guige\"><span>" + data.data.content[i].price + "积分</span><span>" + data.data.content[i].promotionPrice + "对货券积分</span></P>" +

							"<p class=\"prdmoney\">" + data.data.content[i].price + " 元</p>" +

							"</li>"

					}

					setTimeout(function() {

						$(".prdlist .loadingbox").hide();

						$(".prdlist ul").append(html)

					}, 500)

					var page = ""

					for(var j = 1; j <= data.data.totalPages; j++) {

						if(pageNo == j) {

							page += "<li class='active'>" + j + "</li>"

						} else {

							page += "<li>" + j + "</li>"

						}

						//						page += "<li>" + j + "</li>"

					}

					$(".page ul").append(page)

				}

			},

			error: function() {

			}

		});

	},

	AddEvent: function() {

		var self = this

		//退货
		$("body").on('click', '.Returnbtn', function(event) {
			var id = $(this).attr("id");
			var storeName = $(this).attr("storeName");
			var orderState = 3;
			var dialog = bootbox.dialog({
				title: '温馨提示',
				message: "<div><p class=\"text-center \">确定要退货吗？</p><p class=\"text-center \">请把本订单所有商品送到</p><h4 class=\"text-center brown\">" + storeName + "</h4><P class=\"text-center \">退货商品不可影响二次销售，开封或影响二次销售 将不给予退货。<p></div>",
				size: 'middle',
				buttons: {
					noclose: {
						label: "确定退货",
						className: 'btn-info btn-block col-6 center-block ma  ',
						callback: function() {
							window.location.href = 'login.html'
						}
					}
				}
			})
			//			self.PickUpgoods(id, orderState, event);
		})
		//确认取货
		$("body").on('click', '.confirmbtn', function(event) {
			var id = $(this).attr("id");
			var orderState = 3;
			self.PickUpgoods(id, orderState, event);
		})
		//取货
		$("body").on('click', '.qhbtn', function(event) {
			var id = $(this).attr("id");
			var orderState = 2;
			self.PickUpgoods(id, orderState, event);
		})
		$("#xgmm a").click(function() {

			var btnstr = $(this).attr("id")

			$(".tpsbox_bg,.tpsbox").fadeIn()

			$("#" + btnstr + "ctn").show().siblings().hide()

			$(".tpsbox .message").html("");

		})

		//添加银行卡

		$("#sendyhk").click(function() {

			var _isInvalid = false;

			$("#yhkctn input").each(function() {

				if(!$(this).val()) {

					$(this).addClass("redborder")

					_isInvalid = true;

					return false;

				}

			});

			if(_isInvalid) {

				return false;

			}

			$.ajax({

				type: "post",

				url: Work_Config.InterfaceDomain + "/user/modifyShopUserForBank",

				async: true,

				data: {

					token: localStorage.getItem("token"),

					bank: $("#bank").val(),

					bankAccountName: $("#bankAccountName").val(),

					bankCardNumber: $("#bankCardNumber").val()

				},

				success: function(data) {

					if(data.code == 0) {

						$(".tpsbox .message").html(data.message);

						setTimeout(function() {

							$(".tpsbox_bg,.tpsbox").fadeOut()

							window.location.reload()

						}, 2000)

					} else {

						$(".tpsbox .message").html(data.message);

					}

				},

				error: function() {

				}

			});

		})

		//修改交易密码

		$("#sendjymm").click(function() {

			var _isInvalid = false;

			$("#jymmctn input").each(function() {

				if(!$(this).val()) {

					$(this).addClass("redborder")

					_isInvalid = true;

					return false;

				}

			});

			if(_isInvalid) {

				return false;

			}

			$.ajax({

				type: "post",

				url: Work_Config.InterfaceDomain + "/user/modifyShopUserForTransactionPassword",

				async: true,

				data: {

					token: localStorage.getItem("token"),

					email: $("#email").val(),

				},

				success: function(data) {

					if(data.code == 0) {

						$(".tpsbox .message").html(data.message);

						setTimeout(function() {

							$(".tpsbox_bg,.tpsbox").fadeOut()

						}, 2000)

					} else {

						$(".tpsbox .message").html(data.message);

					}

				},

				error: function() {

				}

			});

		})

		//修改邮箱

		$("#sendxgyx").click(function() {

			var _isInvalid = false;

			$("#xgyxctn input").each(function() {

				if(!$(this).val()) {

					$(this).addClass("redborder")

					_isInvalid = true;

					return false;

				}

			});

			if(_isInvalid) {

				return false;

			}

			$.ajax({

				type: "post",

				url: Work_Config.InterfaceDomain + "/user/modifyShopUserForEmail",

				async: true,

				data: {

					token: localStorage.getItem("token"),

					email: $("#email").val(),

				},

				success: function(data) {

					if(data.code == 0) {

						$(".tpsbox .message").html(data.message);

						setTimeout(function() {

							$(".tpsbox_bg,.tpsbox").fadeOut()

						}, 2000)

					} else {

						$(".tpsbox .message").html(data.message);

					}

				},

				error: function() {

				}

			});

		})

		//修改手机号

		$("#senddsjh").click(function() {

			var _isInvalid = false;

			$("#sjhctn input").each(function() {

				if(!$(this).val()) {

					$(this).addClass("redborder")

					_isInvalid = true;

					return false;

				}

			});

			if(_isInvalid) {

				return false;

			}

			$.ajax({

				type: "post",

				url: Work_Config.InterfaceDomain + "/user/modifyShopUserForMobilePhone",

				async: true,

				data: {

					token: localStorage.getItem("token"),

					mobilePhone: $("#mobilePhone").val(),

				},

				success: function(data) {

					if(data.code == 0) {

						$(".tpsbox .message").html(data.message);

						setTimeout(function() {

							$(".tpsbox_bg,.tpsbox").fadeOut()

						}, 2000)

					} else {

						$(".tpsbox .message").html(data.message);

					}

				},

				error: function() {

				}

			});

		})

		//修改登录密码

		$("#senddlmm").click(function() {

			var _isInvalid = false;

			$("#dlmmctn input").each(function() {

				if(!$(this).val()) {

					$(this).addClass("redborder")

					_isInvalid = true;

					return false;

				}

			});

			if(_isInvalid) {

				return false;

			}

			$.ajax({

				type: "post",

				url: Work_Config.InterfaceDomain + "/user/modifyShopUserForLoginPassword",

				async: true,

				data: {

					token: localStorage.getItem("token"),

					loginPassword: $("#loginPassword").val(),

					loginPasswordNew: $("#loginPasswordNew").val()

				},

				success: function(data) {

					if(data.code == 0) {

						$(".tpsbox .message").html(data.message);

						setTimeout(function() {

							window.location.href = "login.html"

						}, 2000)

					} else {

						$(".tpsbox .message").html(data.message);

					}

				},

				error: function() {

				}

			});

		})

		//修改查询密码

		$("#sendcxmm").click(function() {

			var _isInvalid = false;

			$("#cxmmctn input").each(function() {

				if(!$(this).val()) {

					$(this).addClass("redborder")

					_isInvalid = true;

					return false;

				}

			});

			if(_isInvalid) {

				return false;

			}

			$.ajax({

				type: "post",

				url: Work_Config.InterfaceDomain + "/user/modifyShopUserForQueryPassword",

				async: true,

				data: {

					token: localStorage.getItem("token"),

					queryPassword: $("#queryPassword").val(),

					queryPasswordNew: $("#queryPasswordNew").val()

				},

				success: function(data) {

					if(data.code == 0) {

						$(".tpsbox .message").html(data.message);

						//										setTimeout(function() {

						//											window.location.href = "login.html"

						//										}, 2000)

					} else {

						$(".tpsbox .message").html(data.message);

					}

				},

				error: function() {

				}

			});

		})

		$("input").change(function() {

			$("input").removeClass("redborder")

		});

		$("#exit").click(function() {

			var accountJSON = localStorage.getItem('accountlist');

			localStorage.setItem("token", "");

			localStorage.setItem("usarData", "");

			if(accountJSON) {

				var list = JSON.parse(accountJSON);

				if(list.length > 0) {

					location.href = 'SelectAccount.html';

					return;

				}

			}

			window.location.href = "index.html"

		});

		$(".close").click(function() {

			// $(this).parent().parent().fadeOut()

			$(".tpsbox_bg").fadeOut()

			$("#message").fadeOut()

		});

		//		转账

		$(".sendmoney").click(function() {

			self.sendmoney(0)

		})

		$(".sendmoneyDh").click(function() {

			self.sendmoney(1)

		})
		$("body").on('click', '.zfbtn', function() {
			var bonusPayAmount = $(this).attr("bonusPayAmount")
			var couponPayAmount = $(this).attr("couponPayAmount")
			$("#zfjf").html(bonusPayAmount)
			$("#zfdhq").html(couponPayAmount)
			$(".tpsbox_bg,.tpsbox").fadeIn()
			orderId = $(this).attr("id")
			//						付费
			$("#sendjymm").click(function() {
				$.ajax({
					type: "post",
					url: Work_Config.InterfaceDomain + "/user/checkTransactionPassword",
					async: true,
					data: {
						token: localStorage.getItem("token"),
						transactionPassword: $("#transactionPassword").val()
					},
					success: function(data) {
						if(data.code == 0) {
							$(".tpsbox_bg,.tpsbox").fadeOut()
							$.ajax({
								type: "post",
								url: Work_Config.InterfaceDomain + "/order/orderPayment",
								async: true,
								data: {
									token: localStorage.getItem("token"),
									orderId: orderId
								},
								success: function(data) {
									if(data.code == 0) {

										var dialog = bootbox.dialog({
											title: '温馨提示',
											message: "<div><h2 class=\"text-center \"><br/><br/>提交成功！<br/><br/><br/></h2></div>",
											size: 'middle'

										})
										setTimeout(function() {
											window.location.href = 'UserCenter-orders.html'
										}, 2000)

									} else {
										bootbox.alert(data.message)
									}

								},
								error: function() {

								}
							});
						} else {
							bootbox.alert(data.message)
						}

					},
					error: function() {

					}
				});
			})
		})

	}

}

//登录数据请求

function GetRequestNum(SendType, url, SendData, callBack, async, isAddToken) {

	$.ajax({

		type: SendType || "Post",

		url: url,

		data: SendData, // ,

		async: async || false,

		beforeSend: function(request) {},

		success: function(Data) {

			Data = typeof Data == "string" ? eval("(" + Data + ")") : Data;

			switch(Data.code) {

				case "0":

					edalert(Data.msg);

					break;

				case "1":

					Work_Config.SetToken(Data.data.token, "TokenUserID");

					Work_Config.SetToken(

						Data.data.user.InsuranceInfoId,

						"InsuranceInfoId"

					);

					localStorage.setItem('Phone', Data.data.user.Phone)

					var callBackUrl = localStorage.getItem("TokenUserID");

					//是否存在回调页面url

					if(callBackUrl != null) {

						//跳转并携带token

						window.location.href = "index.html";

					} else {

						window.location.href = "logout.html";

					}

					break;

				default:

					edalert(Data.msg);

					// throw new Error(Data.msg);

					break;

			}

		}

	});

}

//其他数据请求

function GetRequestData(SendType, url, SendData, callBack, async, isAddToken) {

	$.ajax({

		type: SendType || "Post",

		//url: url + (SendType.toUpperCase() == "POST" ? "?" + $.param(SendData) : ""),

		url: url,

		// //url: url,

		data: SendData, // ,

		async: async || false,

		beforeSend: function(request) {

			request.setRequestHeader(

				"access_token",

				localStorage.getItem(Work_Config.TokenKey)

			);

		},

		success: function(Data) {

			Data = typeof Data == "string" ? eval("(" + Data + ")") : Data;

			switch(Data.code) {

				case "0":

					// edalert(Data.msg);

					break;

				case "1":

					// GetData = Data;

					callBack(Data);

					break;

				default:

					// window.location = Work_Config.LoginUrl + "?" + Work_Config.CallBackUrlKey + "=" + Work_Config.HomePage;

					break;

			}

		}

	});

}

function logOut() {

	localStorage.clear();

	window.location.href = "logout.html";

}

//公告退出

//公共左侧菜单

//goInit()

function goInit() {

	$("#content_body").html(

		`<h2 style="font-size: 31.5px; text-align: center; font-weight: normal;margin-top:30px;">欢迎登陆财税问券</h2><div style="text-align: center; font-size: 20px; line-height: 20px;">欢迎使用 </div>`

	);

}

//获取页面间参数传递（部分视图由于嵌入在同一页面中，不能使用url传递参数，采用参数对象放入Window对象中）

function GetPageParamer(paramerKey, objName) {

	//参数1：具体参数名， 参数2：整体参数对象名

	//获取通过window传参,未成功尝试获取url参数

	// return (window[objName || "PageFormData_Paramer"][paramerKey]) || getQueryString(paramerKey);

	return typeof window[objName || "PageFormData_Paramer"] != "undefined" ?

		window[objName || "PageFormData_Paramer"][paramerKey] :

		getQueryString(paramerKey);

}

//获取Token中的用户信息

function GetUserInfoByToken() {

	//用户信息

	var UserInfo = {};

	//反向解析Token

	var tokenValue = new Base64().decode(

		Work_Config.GetToken(Work_Config.TokenKey).split(".")[1]

	);

	//去掉特殊字符

	tokenValue = tokenValue.replace(new RegExp("\u0000", "gm"), "");

	try {

		UserInfo = eval("(" + eval("(" + tokenValue + ")").payload + ")");

	} catch(e) {

		//获取用户ID（临时解决方案）

		//var userId = tokenValue.substring(tokenValue.indexOf("roleids") + 7, tokenValue.indexOf("username")).split(":")[1].split(",")[0];

	}

	return UserInfo;

}

//刷新当前页面对应的全部选项卡

function RefreshIfram(ExcludeSelf) {

	// ExcludeSelf:是否排除当前页

	debugger;

	////当前选项卡地址

	//var selfSrc = window.location.href;

	////遍历当前窗体父级所有Ifram.

	//for (var i = 0; i < window.parent.frames.length; i++) {

	//    //获取当前ifram地址

	//    var RefreshSrc = window.parent.frames[i].location.href;

	//    if (ExcludeSelf && selfSrc != RefreshSrc) {

	//        //刷新当前页面夫级容器ifram

	//        window.parent.frames[i].location.href = window.parent.frames[i].location.href;

	//    }

	//}

}

////是否被包含,是返回true,不是返回false

//function isContained(a, b) {

//    if (!(a instanceof Array) || !(b instanceof Array)) return false;

//    if (a.length < b.length) return false;

//    var aStr = a.toString();

//    for (var i = 0, len = b.length; i < len; i++) {

//        if (aStr.indexOf(b[i]) == -1) return false;

//    }

//    return true;

//}

/*---------------------------------------------------------------------------页面新增按钮权限控制--------------------------------------------------------------------------------*/

//根据权限添加功能按钮

function AddButtonByResource(url, callBack) {

	//参数1：数据接口地址， 参数2：回调函数

	//根据请求地址判断 是否有无按钮权限

	var allResource = GetAllRessource();

	//是否存在当前url对应资源

	var addUrlResource = allResource.filter(function(item, index, arr) {

		return item.Url == url;

	});

	//存在保存权限，创建按钮

	if(addUrlResource.length > 0) {

		callBack();

	}

}

//获取当前角色对应全部资源

function GetAllRessource() {

	var resourceArr = [];

	//从接口获取数据

	GetRequestData(

		"Get",

		Work_Config.SSOUrl + "/user/resource_app", {

			jsonStr: JSON.stringify({

				AppID: "2"

			})

		},

		function(Data) {

			resourceArr = Data.data;

		},

		false,

		true

	);

	return resourceArr;

}

/*-------------------------------------------------------------------------------页面只读权限控制--------------------------------------------------------------------------------*/

(function($, window) {

	var Management = (function() {

		//列表管理对象

		function Management(_option, pageManagement) {

			//被控制页面操作对象

			this.pageManagement = pageManagement;

			//参数对象

			this.option = {

				//接口地址 (必填，接口地址)

				url: "",

				//表单容器层ID (如果填写了容器层ID,则默认采取容器层ID为父级容器)

				ContainerID: "", //Page_From

				//jquery选择器

				inputSelect: ":input",

				//执行自定义权限控制回调函数

				callBack: null,

				//获取权限资源接口

				GetResourceArr: function() {

					return GetAllRessource();

				}

			};

			//参数注入

			$.extend(true, this.option, _option);

			//控件初始化

			this.Init();

		}

		//管理对象功能拓展

		Management.prototype = {

			//初始化

			Init: function() {

				//权限控制

				this.Jurisdiction();

			},

			//权限控制

			Jurisdiction: function(option) {

				//执行通用回调处理

				this.pageReadOnline();

			},

			//页面只读权限控制(实现原则：url参数为页面保存的接口地址,通过全量资源判断是否有当前保存地址的权限，如果没有则通过this获取当前表单容器层ID,通过jquery选择器拿到当前表单所有input控件，进行只读设置)

			pageReadOnline: function() {

				//参数1：页面保存接口地址,参数2：实现自定义只读权限控制

				//判断是否拥有当前编辑权限

				if(!this.isHaveResource()) {

					//是否存在页面自定义回调函数

					if(typeof this.option.callBack == "function") {

						//执行自定义回调函数处理只读

						$.proxy(this.option.callBack, this)();

					} else {

						//设置只读控制

						this.SetReadOnly();

						//刷新列表select控件

						this.BootStrapSelectRefalsh();

					}

				}

			},

			//BootStrapSelect初始化

			BootStrapSelectRefalsh: function() {

				//刷新

				$(

					".selectpicker",

					"#" +

					(this.ContainerID != "" ?

						this.ContainerID :

						typeof this.pageManagement.ContainerID)

				).selectpicker("refresh");

			},

			//设置只读

			SetReadOnly: function() {

				//确定父容器ID   如果传参设置了，以传参为准，未设置获取调用页面表单配置，如果未获取到，则取默认 Page_From

				var parentContainerID =

					this.option.ContainerID == "" ?

					typeof this.pageManagement.ContainerID != "undefined" ?

					this.pageManagement.ContainerID :

					"Page_From" :

					this.option.ContainerID;

				//执行权限控制,

				$(this.option.inputSelect, "#" + parentContainerID)

					.not(":button.btn-danger")

					.attr("disabled", "disabled");

			},

			//判断是否拥有当前资源url权限

			isHaveResource: function() {

				//接口地址项目名 http：//10.106.29.250:8484/CrmDataService

				var projectName = Work_Config.InterfaceDomain.split("/")[3]; //获取 CrmDataService 部分

				//获取当前页面接口地址 (是否传递了接口地址，未从参数传递尝试读取当前页面配置地址)

				var url =

					this.option.url == "" ?

					typeof this.pageManagement.GetUrlByPageType == "function" ?

					"/" + projectName + this.pageManagement.GetUrlByPageType() :

					edalert("未能获取只读权限接口地址！") :

					this.option.url;

				//获取当前用户所拥有全部资源

				var resourceArr = this.option.GetResourceArr();

				//判断是否拥有当前保存权限

				return(

					resourceArr.filter(function(item, index, arr) {

						//判断是否拥有当前接口

						return item.Url == url;

					}, this).length > 0

				);

			}

		};

		return Management;

	})();

	//创建插件

	function Plugin(option) {

		//参数1：参数集合， 参数2：当前页面管理对象

		return new Management(option, this);

	}

	//加入Jquery原型链

	$.extend({

		//创建插件

		pageJurisdiction: Plugin

	});

})(jQuery, this);

/*-------------------------------------------------------------------------------向上，或者向下递归树形结构数据深度（返回数据集合）--------------------------------------------------------------------------------*/

(function($, window) {

	var Management = (function() {

		//列表管理对象

		function Management(_option) {

			//参数对象

			this.option = {

				//当前节点ID

				currentId: "",

				//数据源

				DataList: [],

				//向上迭代，还是向下迭代

				direction: "up", // up , down

				//字典配置

				dataSetting: {

					id: "",

					pid: "",

					name: ""

				}

			};

			//参数注入

			$.extend(true, this.option, _option);

			//迭代队列

			this.DataQueue = [];

			//控件初始化

			this.Init();

		}

		//管理对象功能拓展

		Management.prototype = {

			//初始化

			Init: function() {

				//迭代

				this.iteration(

					this.option.currentId,

					this.option.direction == "up" ? "id" : "pid"

				);

			},

			//迭代

			iteration: function(currentId, type) {

				//参数1，当前节点（可能代表ID，也可能代表父ID），参数2：向上迭代，还是向下迭代

				//获取 当前ID对应的数据源

				var itemArr = this.GetItemById(currentId, type);

				//循环ID等于当前值的所有数据

				itemArr.forEach(function(item, index, arr) {

					//入队列

					this.DataQueue.push(item);

					//迭代 子集，或者父级

					this.iteration(

						item[

							this.option.direction == "up" ?

							this.option.dataSetting.pid :

							this.option.dataSetting.id

						],

						this.option.direction == "up" ? "id" : "pid"

					);

				}, this);

			},

			//根据ID获取当前数据

			GetItemById: function(id, type) {

				//根据类型 获取数据

				return this.option.DataList.filter(function(item, index, arr) {

					//获取 ID，或者Pid 对应的数据

					return item[this.option.dataSetting[type]] == id;

				}, this);

			}

		};

		return Management;

	})();

	//创建插件

	function Plugin(option) {

		//参数1：参数集合， 参数2：当前页面管理对象

		var obj = new Management(option, this);

		//返回迭代队列

		return obj.DataQueue;

	}

	//加入Jquery方法链

	$.extend({

		//获取当前节点对应数据结构深度

		GetTreeDataDepth: Plugin

	});

})(jQuery, this);

/*-------------------------------------------------------------------------------公共方法部分--------------------------------------------------------------------------------*/

//日期格式化

var DateFormatWithOutM = function(dateTime) {

	if(dateTime) {

		var date = new Date(

			parseInt(dateTime.replace("/Date(", "").replace(")/", ""), 10)

		);

		var month =

			date.getMonth() + 1 < 10 ?

			"0" + (date.getMonth() + 1) :

			date.getMonth() + 1;

		return date.getFullYear() + "-" + month;

	}

	return "";

	//return date.getFullYear() + "-" + month + "-" + currentDate + " " + hour + ":" + min;

};

//Base64 加解密

function Base64() {

	// private property

	_keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";

	// public method for encoding

	this.encode = function(input) {

		var output = "";

		var chr1, chr2, chr3, enc1, enc2, enc3, enc4;

		var i = 0;

		input = _utf8_encode(input);

		while(i < input.length) {

			chr1 = input.charCodeAt(i++);

			chr2 = input.charCodeAt(i++);

			chr3 = input.charCodeAt(i++);

			enc1 = chr1 >> 2;

			enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);

			enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);

			enc4 = chr3 & 63;

			if(isNaN(chr2)) {

				enc3 = enc4 = 64;

			} else if(isNaN(chr3)) {

				enc4 = 64;

			}

			output =

				output +

				_keyStr.charAt(enc1) +

				_keyStr.charAt(enc2) +

				_keyStr.charAt(enc3) +

				_keyStr.charAt(enc4);

		}

		return output;

	};

	// public method for decoding

	this.decode = function(input) {

		var output = "";

		var chr1, chr2, chr3;

		var enc1, enc2, enc3, enc4;

		var i = 0;

		input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

		while(i < input.length) {

			enc1 = _keyStr.indexOf(input.charAt(i++));

			enc2 = _keyStr.indexOf(input.charAt(i++));

			enc3 = _keyStr.indexOf(input.charAt(i++));

			enc4 = _keyStr.indexOf(input.charAt(i++));

			chr1 = (enc1 << 2) | (enc2 >> 4);

			chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);

			chr3 = ((enc3 & 3) << 6) | enc4;

			output = output + String.fromCharCode(chr1);

			if(enc3 != 64) {

				output = output + String.fromCharCode(chr2);

			}

			if(enc4 != 64) {

				output = output + String.fromCharCode(chr3);

			}

		}

		output = _utf8_decode(output);

		return output;

	};

	// private method for UTF-8 encoding

	_utf8_encode = function(string) {

		string = string.replace(/\r\n/g, "\n");

		var utftext = "";

		for(var n = 0; n < string.length; n++) {

			var c = string.charCodeAt(n);

			if(c < 128) {

				utftext += String.fromCharCode(c);

			} else if(c > 127 && c < 2048) {

				utftext += String.fromCharCode((c >> 6) | 192);

				utftext += String.fromCharCode((c & 63) | 128);

			} else {

				utftext += String.fromCharCode((c >> 12) | 224);

				utftext += String.fromCharCode(((c >> 6) & 63) | 128);

				utftext += String.fromCharCode((c & 63) | 128);

			}

		}

		return utftext;

	};

	// private method for UTF-8 decoding

	_utf8_decode = function(utftext) {

		var string = "";

		var i = 0;

		var c = (c1 = c2 = 0);

		while(i < utftext.length) {

			c = utftext.charCodeAt(i);

			if(c < 128) {

				string += String.fromCharCode(c);

				i++;

			} else if(c > 191 && c < 224) {

				c2 = utftext.charCodeAt(i + 1);

				string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));

				i += 2;

			} else {

				c2 = utftext.charCodeAt(i + 1);

				c3 = utftext.charCodeAt(i + 2);

				string += String.fromCharCode(

					((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63)

				);

				i += 3;

			}

		}

		return string;

	};

}

// 普通alert提示框

function edalert(message) {

	if(message == undefined) {} else {

		// $.jAlert(message);

		swal(message);

	}

}

function edalertSuc(message) {

	if(message == undefined) {} else {

		swal(message, "", "success");

	}

}

function edconfirm(message, afterfunction) {

	$.jConfirm(message, afterfunction);

}

function Close(name, effectiveAction, Cdata) {

	$.closePopupLayer(name, effectiveAction, Cdata);

}

// loading

var loadArray = [

	'<div id="nest5"></div>',

	'<div id="nest5"></div>',

	'<div id="bars2"><span></span><span></span><span></span><span></span><span></span></div>',

	'<div id="bars4"><span></span><span></span><span></span><span></span><span></span></div>',

	'<div id="bars5"><span></span><span></span><span></span><span></span><span></span></div>',

	'<div id="bars6"><span></span><span></span><span></span><span></span><span></span></div>',

	'<div id="dots5"><span></span><span></span><span></span><span></span></div>',

	'<div id="square6"><span></span><span></span><span></span><span></span></div>',

	'<div id="triangle5"><span></span><span></span><span></span></div>',

	'<div id="wave1"></div>',

	'<div id="spinner5"></div>',

	'<div id="circle6"></div>',

	'<div id="nest2"></div>',

	'<div id="nest3"></div>'

];

// 获取url 参数

function getQueryString(name) {

	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");

	var r = window.location.search.substr(1).match(reg);

	if(r != null) return unescape(r[2]);

	return null;

}

// 改变当前执行函数this作用域

var __bind = function(fn, me) {

	return function() {

		return fn.apply(me, arguments);

	};

};

//数据绑定

function ddlDataBind(

	ControlObj,

	dataSouce,

	txtName,

	valueName,

	groupName,

	isAddUndefined,

	DefaultValue

) {

	//清空数据源

	ControlObj.innerHTML = "";

	//获取第一个下拉菜单对象

	var select = ControlObj;

	//循环遍历赋值

	if(dataSouce != null && select != null) {

		//判断是否包含组别

		if(groupName != null && groupName != "") {

			//按组别去重

			var groupList = DataDistinct(dataSouce, groupName);

			//html

			var optionHtml = "";

			for(var i = 0; i < groupList.length; i++) {

				if(isAddUndefined && i == 0) {

					optionHtml += '<optgroup label="请选择">';

					optionHtml += '<option value="">-请选择-</option>';

					optionHtml += "</optgroup>";

				}

				optionHtml += '<optgroup label="' + groupList[i] + '">';

				//获取组别对应得数据集合

				var dataList = dataSouce.filter(function(item) {

					return item[groupName] == groupList[i];

				});

				//拼接option

				for(var k = 0; k < dataList.length; k++) {

					optionHtml +=

						"<option " +

						(dataList[k][valueName] == DefaultValue ?

							'selected="selected"' :

							"") +

						' value="' +

						dataList[k][valueName] +

						'">' +

						dataList[k][txtName] +

						"</option>";

				}

				optionHtml += "</optgroup>";

			}

			select.innerHTML = optionHtml;

		} else {

			for(var j = 0; j < dataSouce.length; j++) {

				if(isAddUndefined && j == 0) {

					var oOptionUn = document.createElement("OPTION");

					select.options.add(oOptionUn);

					oOptionUn.value = "";

					oOptionUn.innerText = "-请选择-";

				}

				var oOption = document.createElement("OPTION");

				select.options.add(oOption);

				oOption.value = dataSouce[j][valueName];

				oOption.innerText = dataSouce[j][txtName];

				//如果存在默认值，设置选中

				if(DefaultValue == dataSouce[j][valueName]) {

					oOption.selected = true;

				}

			}

		}

	}

}

//数据去重

function DataDistinct(arr, colName) {

	var result = [],

		hash = {};

	//循环每一个Obj对象,为空则意味着遍历完毕。

	for(var i = 0, elem;

		(elem = arr[i]) != null; i++) {

		//判断哈希表中是否已存在该值

		if(!hash[elem[colName]]) {

			//不存在

			//追加当前数据值

			result.push(elem[colName]);

			hash[elem[colName]] = true;

		}

	}

	return result;

}

//// 下拉列表数据绑定

//function SelectDataBind(ControlObj, dataList, txtName, valueName, isAddUndefined) {

//    // 清空之前选项

//    ControlObj.innerHTML = "";

//    // 获取第一个下拉菜单对象

//    var select = ControlObj;

//    // 循环遍历赋值

//    if (dataList != null) {

//        for (var j = 0; j < dataList.length; j++) {

//            if (isAddUndefined && j == 0) {

//                var oOptionUn = document.createElement("OPTION");

//                select.options.add(oOptionUn);

//                oOptionUn.value = "";

//                oOptionUn.innerText = "-请选择-";

//            }

//            var oOption = document.createElement("OPTION");

//            select.options.add(oOption);

//            oOption.value = dataList[j][valueName];

//            oOption.innerText = dataList[j][txtName];

//        }

//    }

//}

(function($, window, undefined) {

	var elems = $([]),

		jq_resize = ($.resize = $.extend($.resize, {})),

		timeout_id,

		str_setTimeout = "setTimeout",

		str_resize = "resize",

		str_data = str_resize + "-special-event",

		str_delay = "delay",

		str_throttle = "throttleWindow";

	jq_resize[str_delay] = 15;

	jq_resize[str_throttle] = true;

	$.event.special[str_resize] = {

		setup: function() {

			if(!jq_resize[str_throttle] && this[str_setTimeout]) {

				return false;

			}

			var elem = $(this);

			elems = elems.add(elem);

			$.data(this, str_data, {

				w: elem.width(),

				h: elem.height()

			});

			if(elems.length === 1) {

				loopy();

			}

		},

		teardown: function() {

			if(!jq_resize[str_throttle] && this[str_setTimeout]) {

				return false;

			}

			var elem = $(this);

			elems = elems.not(elem);

			elem.removeData(str_data);

			if(!elems.length) {

				clearTimeout(timeout_id);

			}

		},

		add: function(handleObj) {

			if(!jq_resize[str_throttle] && this[str_setTimeout]) {

				return false;

			}

			var old_handler;

			function new_handler(e, w, h) {

				var elem = $(this),

					data = $.data(this, str_data);

				if(typeof data != "undefined") {

					data.w = w !== undefined ? w : elem.width();

					data.h = h !== undefined ? h : elem.height();

				}

				old_handler.apply(this, arguments);

			}

			if($.isFunction(handleObj)) {

				old_handler = handleObj;

				return new_handler;

			} else {

				old_handler = handleObj.handler;

				handleObj.handler = new_handler;

			}

		}

	};

	function loopy() {

		timeout_id = window[str_setTimeout](function() {

			elems.each(function() {

				var elem = $(this),

					width = elem.width(),

					height = elem.height(),

					data = $.data(this, str_data);

				if(width !== data.w || height !== data.h) {

					elem.trigger(str_resize, [(data.w = width), (data.h = height)]);

				}

			});

			loopy();

		}, jq_resize[str_delay]);

	}

})(jQuery, this);

//禁用浏览器右键菜单功能

document.oncontextmenu = new Function("return false");