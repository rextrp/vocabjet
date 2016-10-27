var int=self.setInterval("clock()",50);
var vTmp=[];
var setupBfrAry=[];
var engStrAry=[""];//供更新下拉清單用
var engBfSuff="";//供更新下拉清單用

var engStr;
var previousEngStrForPkgEditor;
var bldrAry=["vocEN","vocCH","vocKK","vocPOStxt","vocRmk","vocEx","vocOri","vocId","vocTag"];
var bldrAryLen = bldrAry.length;
var todayVocAry;
var todayVocAryLen;
var doOnlineCtr=false;//紀錄按下線上人數的狀態

var bracketNum;
var tempOffset=0;
var nextWordClicked=false;
var editCtr;
var global_flipLogYear;
var global_flipLogMonth;
var _idleSecondsCounter = 0;
var idleTimer;
var idleTimePage;
var updateSessionTimer;
var orgEng;//保留英文欄的值，無異動就不清除中文、音標等欄位
var dicNewWindow;//字典視窗
var idleTimerStopped=false;
var chsnDicNum=0;



var validNavigation = false;//偵測關閉分頁

var pkgNameAry = [];
pkgNameAry.push([3481, 'BA_01', '初級一']);
pkgNameAry.push([3484, 'BA_02', '初級二']);
pkgNameAry.push([3486, 'ME_01', '中級一']);
pkgNameAry.push([3487, 'ME_02', '中級二']);
pkgNameAry.push([3488, 'ME_03', '中級三']);
pkgNameAry.push([3496, 'AD_01', '高級一']);
pkgNameAry.push([3497, 'AD_02', '高級二']);
pkgNameAry.push([3498, 'AD_03', '高級三']);
pkgNameAry.push([3504, 'TE_01', '多益一']);
pkgNameAry.push([3505, 'TE_02', '多益二']);
pkgNameAry.push([3506, 'TE_03', '多益三']);
pkgNameAry.push([3499, 'TF_01', '托福一']);
pkgNameAry.push([3500, 'TF_02', '托福二']);
pkgNameAry.push([3501, 'TF_03', '托福三']);
pkgNameAry.push([3502, 'TF_04', '托福四']);
pkgNameAry.push([3503, 'TF_05', '托福五']);
pkgNameAry.push([3482, 'GR_01', 'GRE一']);
pkgNameAry.push([3485, 'GR_02', 'GRE二']);
pkgNameAry.push([3489, 'GR_03', 'GRE三']);
pkgNameAry.push([3490, 'GR_04', 'GRE四']);
pkgNameAry.push([3491, 'GR_05', 'GEE五']);
pkgNameAry.push([3492, 'GR_06', 'GRE六']);
pkgNameAry.push([3493, 'GR_07', 'GRE七']);
pkgNameAry.push([3494, 'GR_08', 'GRE八']);
pkgNameAry.push([3508, 'TR_01', '旅遊(試)']);
pkgNameAry.push([3509, 'TR_02', '商務(試)']);
pkgNameAry.push([3510, 'TR_03', '動植(試)']);
pkgNameAry.push([3511, 'TR_04', '飲食(試)']);
pkgNameAry.push([3512, 'TR_05', '日用(試)']);
pkgNameAry.push([3513, 'TR_06', '人體(試)']);
pkgNameAry.push([3514, 'TR_07', '國家(試)']);
pkgNameAry.push([3515, 'TR_08', '學校(試)']);
pkgNameAry.push([3516, 'TR_09', 'GRE (試)']);
pkgNameAry.push([3539, 'TR_10', '軍語(試)']);
pkgNameAry.push([3565, 'TR_11', '初級(試)']);
pkgNameAry.push([3566, 'TR_12', '中級(試)']);
pkgNameAry.push([3567, 'TR_13', '高級(試)']);
pkgNameAry.push([3568, 'TR_14', '托福(試)']);
pkgNameAry.push([3569, 'TR_15', '多益(試)']);
pkgNameAry.push([3637, 'BA_00', '零基礎']);
pkgNameAry.push([3636, 'TR_16', '零基礎(試)']);


function addToMyTable(_actType){
	var fnIfSuccess = function (data) {
		if(data.trim()=='沒cookie'){
			//showCookieExpiredModalAndLogout();		
		}else{
			addToMyTable_part2(_actType);
		 }
	 }
	callPhpFn('chkCookie', '', fnIfSuccess);
}
function addToMyTable_part2(_actType){//actType 1=>存檔後回我的字庫 2=>存檔後換下一字	
	$('#addAnoVoc').text('');//先清除modal按鈕文字，避免抓到舊英文字串
	//var rltS1= 'waiting_for_instruction';
	//var rltS2= 'waiting_for_instruction';
	for(var i=0; i<bldrAryLen;i++){
		vTmp[i] = escapeStr($('#'+bldrAry[i]).val()).trim();
	}	
	updateOrgList();//更新出處清單	
	var engStr = $('#addAnoVoc').text();	
	if(engStr !=""){
		vTmp[0] = engStr.replace("編輯","").trim();
	}
	vTmp[0]  = removeBrkNum(vTmp[0]);
	vTmp[2]  = vTmp[2].replace(/[\[\]\/\s]/g,'');	
	vTmp[9]  = localStorage.getItem("orgList");
	vTmp[10] = $('#bktNum').text();
	var cookieOrgEng = getCookie('orgEng');
	if(cookieOrgEng == vTmp[0]){
		vTmp[11] = 'engUnchanged';
	}else{
		vTmp[11] = 'engChanged';
	}
	var fnIfSuccess = function (data) {
//alert(data);
		/*rltS1 = (data.trim()).search('㊣');
		rltS2 = (data.trim()).search('Φ');
		if(rltS1 != '-1'){
			alert('㊣ ： ' + data);
		}else if(rltS2 != '-1'){
			alert('Φ : ' + data);
		}else{
			alert('需要重新檢查！'+ rltS1 + ' & ' + rltS1);
		}*/	
//dicNewWindow.close();
		$('#rootForlink2').addClass('epty');		
		if(data.trim()=='MATCH_FOUND'){//個人字庫有這個字
			srchMyvoc(vTmp[0]);			
		}else if(data.trim() == 'NO_MATCH_FOUND' ){
			toggleTON();
			if(vTmp[7]==""){//這是新字-沒有vocId
				bldrReset();				
				$( "#vocEN" ).focus();			
			}else{//這是編輯-有vocId		
				if(_actType==1){//非安裝包，需判斷是myvoc編輯還是todayvoc編輯
					//_actType 決定完成存檔後換回原頁或直接編下一字					
					if($("#editCaller").val()=="myvoc"){//非安裝包，從myvoc來的，回檢視字庫頁並更新table
						go2Front('link2');	
						upDateVocTbl('myvocOfst');//myvocOdr						
					}else{//非安裝包，從todayVoc來的，只要刷新todayVoc頁面				
						//chgDic2("ref/todayVoc.php", "", "", "0");
						$( "#vocEN" ).focus();
					}
					bldrReset();
				}else if(_actType==2){//安裝包//表示在編輯，存檔後不換頁
					upDateVocTbl('myvocOfst');
				}
			}		
		}
	}	
	var isOKToAdd=true;
	if(vTmp[0]=='' || vTmp[1]==''){
		isOKToAdd=false;
		alert('必要欄位未填');
	}
	if(_actType==2){
		if(vTmp[2]=='' || vTmp[3]=='' || vTmp[6]=='' || vTmp[6]=='(未定義)'){
			isOKToAdd=false;
			alert('必要欄位未填');
		}
	}	
	if(isOKToAdd){	
		if(_actType==2){//安裝包
			vTmp[8] = '已審核';
			//dicNewWindow.close();
			editMove('down');
		}
		if(_actType==2 && vTmp[8]==""){//安裝包但未寫入tag
			alert("已審核 not written");
		}
		callPhpFn('addToMyTable', vTmp, fnIfSuccess);
	}	
}
function admV(_destination){		//驗證管理員帳密
	var v0=$('#admV0').val();
	var v1=$('#admV1').val();
	var fnIfSuccess = function (data) {
//alert(data);
		if(data.trim()!='fail'){			
			if(_destination=='m'){
				pasteHtmlToDiv('memMngt', 'rootForadmLink0', '');			
				$('#rootForadmLink0').addClass("epty");
			}else if(_destination=='t'){
				pasteHtmlToDiv('tracking', 'rootForadmLink2', '');			
				$('#rootForadmLink2').addClass("epty");
			}
		}else{
			alert("帳號或密碼錯誤!");
		}
	}
	if(v0!='' && v1!=''){
		callPhpFn('admVerification', [v0,v1], fnIfSuccess);
	}else{
		alert("請輸入帳號密碼!");
	}	
}
function addOption($select, $opt) { //select ID, option value
	var x = document.getElementById($select);
	var option = document.createElement("option");
	option.text = escapeStrBk($opt);
	try {
		x.add(option, x.options[null]);
	} catch (e) {
		x.add(option, null);
	}
}
function adjBldrPos(){				//調整Builder位置，分成原位置跟瀏覽器縮小後兩種
	var windowWidth = $(window).width();
	//alert('width=>'+windowWidth);
	if(windowWidth<1200){	//730	
		$('#blderBlck').removeClass('bldrBlckP1');
		$('#blderBlck').addClass('bldrBlckP2');
	}else{
		$('#blderBlck').removeClass('bldrBlckP2');
		$('#blderBlck').addClass('bldrBlckP1');
	}
}
function animatePkgList(_PkgType){//字庫清單動畫
	//alert('animatePkgList=>'+_PkgType);
	var idStr='';
	if ($(_PkgType).hasClass('hidden')){
		$(_PkgType).removeClass('hidden');		
	}	
	switch(_PkgType){
		case '#vocClass0'   : idStr='#vocClass1_li, #vocClass2_li, #vocClass3_li'; break;
		case '#vocClass1_li': idStr='#vocClass2_li, #vocClass3_li, #vocClass4_li'; break;
		case '#vocClass2_li': idStr='#vocClass1_li, #vocClass3_li, #vocClass4_li'; break;
		case '#vocClass3_li': idStr='#vocClass1_li, #vocClass2_li, #vocClass4_li'; break;
		case '#vocClass4_li': idStr='#vocClass1_li, #vocClass2_li, #vocClass3_li'; break;
	}
	$(idStr).addClass('hidden');
}
function ansBackK(){				//小鍵盤「倒退鍵」
	//alert('click');
	var o = document.getElementById('vocKK');
	var kk= o.value;
	var kkLen= kk.length;
	var selStart= getSelectionStart(o);
	var kkL= kk.slice(0, selStart-1);
	var kkR= kk.slice(selStart,kkLen);	
	$("#vocKK").val(kkL+kkR);
	$('#vocKK').focus();
	document.getElementById('vocKK').setSelectionRange(selStart-1, selStart-1);
}
function batchDel(_tableName){
	var i = 0;
	var idStr = "";
	var chkHead="";
	var pgDataId="";
	var db="";
	var tbl="";	
	switch(_tableName){
		case "tracking":
			chkHead="behrChk";
			pgDataId="bvhr";
			db="vocabje1_admin";
			tbl="viewerActRec";	
			break;
	}
	while (document.getElementById( chkHead + i) != null) {
		if ($('#'+ chkHead + i).is(":checked")) {
			idStr = idStr + ($("#"+ pgDataId + i).text()).trim() + ",";
		}
		i++;
	}
	idStr= idStr.slice(0, idStr.length-1);
	alert("idStr= "+idStr);
	var fnIfSuccess = function (data) {
		//alert(data);
		if (data.trim() == 'success') {
			pasteHtmlToDiv('tracking', 'rootForadmLink2', '');			
		} else {
			alert('Delete failed');
		}
	}
	callPhpFn('batchDel', [ db, tbl, idStr], fnIfSuccess);
}
function bldrClearAll(){
	bracketNum=0;
	$('#bktNum').html("");
	$('#bktNum').addClass('hidden');
	$('#bldrCover').addClass('hidden');
	$('#vocEN').val('');
	$('#vocCH').val('');
	$('#vocKK').val(' ');
	$('#vocPOStxt').val('');
	$('#vocOri').val('');
	$('#vocEx').val('');
	$('#vocRmk').val('');
	$('#vocId').val('');	
	$('#vocTag').val('');
	$('#choseLastOri').fadeIn(0);
	$('#pkgCover').addClass('hidden');
	doCookieSetup('orgEng', '');
	document.getElementById('vjWindow').innerHTML ="";
	$('#mydicTopTxt').text( "" );
	//$('#vjWindow').removeClass('showYScroll');	
}
function bldrReset(){
	bldrClearAll();
	chgDic2("ref/todayVoc.php", "", "", "0");
}
function behaveTimer() {			//用戶行為計時器
	var d = new Date();
	var n = d.getTime();
	localStorage.setItem("firstRecTime", n);
	var limit = 86400000; //這是一天=1000*60*60*24//<--10800000 這是3小時--144400000=>這是4小時
	var waitTime = 60000; //這是1分鐘//js 1萬指10秒，PHP 10秒就10秒 兩邊都要改
	var timer = setInterval(function () {
			if (limit > 0) {
				updateViewerAct();				
				limit = limit - waitTime;
			} else {
				localStorage.clear();
				clearInterval(timer);
			}
		}, waitTime);
}
function builder(_action){
	var fnIfSuccess = function (data) {
		document.getElementById('rootForlink1').innerHTML =data;		
		chgDic2("ref/todayVoc.php", "", "", "0");//_src, _voc, _windowType
		getOrgList();
		if(localStorage.getItem("lang")=='chs'){tongwen_TtoS();}		
	}
	callPhpFn('builder', '' , fnIfSuccess);//fnVar暫時沒給
}
function callPhpFn(fnName, fnPar, fnIfSuccess) {//執行指定的Ajax Fn
	var myUrl			=	'vocabPHPfn.php';
	var fnNameSubstr	=	fnName.substr(0, 8);
	if( fnNameSubstr == "fromRef_" ){
		myUrl	=	'../vocabPHPfn.php';
		fnName	=	fnName.substr(8, fnName.length);;
	}
//alert(fnName + ' & ' + myUrl);
	$.ajax({
		type : "POST",
		url : myUrl,
		async : true,
		data : {
			fnName	: fnName,
			fnPar 	: fnPar
		},
		error: function(jqXHR, textStatus, errorThrown) {
			if(textStatus == 'timeout'){
				alert('作業逾時，請按F5更新頁面: ' + textStatus);
			}else{
				alert('請按F5更新頁面:狀態： '+textStatus);
				/*alert('請按F5更新頁面，狀態碼：'+jqXHR.status+);*/				
			}
			console.log(jqXHR);
		},		
		success : function (data) {
			fnIfSuccess(data);
		},
		beforeSend : function () {
			$('#loader').removeClass('hidden');
		},
		complete : function (jqXHR, textStatus) {
			$('#loader').addClass('hidden');
			//console.log(jqXHR);
		}
		,timeout: 30000 // sets timeout to 30 seconds
	});
}
function calcTime(offset) {			//utc時間切換成client時間//offset單位是小時
//alert('offset=>'+offset);	
	d = new Date();// create Date object for current location   
	utc = d.getTime() + (d.getTimezoneOffset() * 60000);// convert to msec, add local time zone offsetand  get UTC time in msec
	nd = new Date(utc + (3600000*offset));// create new Date object with supplied offset	
	//var newDstr = nd.toLocaleString();
	ndY= nd.getFullYear();
	ndM= (nd.getMonth())+1;
	if(ndM<10){ ndM = '0'+ ndM; }	
	ndD= nd.getDate();
	if(ndD<10){ ndD = '0'+ ndD; }
	var outputDstr= ndY + '-' + ndM + '-' + ndD;	
//alert(outputDstr);
	return outputDstr;
}
function clrBldrWhenSrch(){			//搜尋時英文無異動就不清除中文、音標等欄位
	$('#bktNum').html("");
	var vocId = $('#vocId').val();
	var eng= $('#vocEN').val().trim();
	if( orgEng!= eng && vocId==''){		
		$('#vocCH').val('');
		$('#vocKK').val('');
		$('#vocPOStxt').val('').attr('selected', true); //讓選單停在第一選項	
		$('#vocOriSel option[value="(未定義)"]').attr('selected', true);		
	}
}
function ctrlTON(){					//控制同上次按鈕
	var txt= $('#vocOri').val();
	var len= txt.length;		
	//alert('length=>'+txt+' & len=>'+len);	
	if(len>0){
		//$('#choseLastOri').addClass('hidden');
		$('#choseLastOri').fadeOut(0);
	}else if(len<=0){
		//$('#choseLastOri').removeClass('hidden');
		$('#choseLastOri').fadeIn(0);
	}
}
function chgMemType(_ctr){
	//alert("type=>"+$("#memType0"+_ctr).val());
	switch($("#memType0"+_ctr).val()){
		case "vocab_user"   	: $('#memType1'+_ctr).addClass('hidden'); break;
		case "vocab_sUser"  	: $('#memType2'+_ctr).addClass('hidden'); break;
		case "vocab_editor" 	: $('#memType3'+_ctr).addClass('hidden'); break;
		case "vocab_pkg"    	: $('#memType4'+_ctr).addClass('hidden'); break;
		case "registered_user"  : $('#memType5'+_ctr).addClass('hidden'); break;
		case "paid_user"    	: $('#memType6'+_ctr).addClass('hidden'); break;
		case "golden_user"    	: $('#memType7'+_ctr).addClass('hidden'); break;
	}
}
function clock(){
	var t = new Date();
	t =(t.getMonth()+1)+"-"+ t.getDate()+"=>"+ t.getHours() + ":" + t.getMinutes() + ":" + t.getSeconds();
	//document.getElementById("clock").value = t;
	if(t!=''){
		$('#clock').val(t);
	}else{
		$('#clock').val('未取得JS時間');
	}	
}
function cstmSrch() {				//自訂查詢
	var defaultWordNumQ = localStorage.getItem('defaultVocPerPage');
	switch(defaultWordNumQ){
		case '0': defaultWordNum='20' ; break;
		case '1': defaultWordNum='50' ; break;
		case '2': defaultWordNum='100'; break;
		default:defaultWordNum='20';
	}
	var item0 = 'odr1'; //排序依據
	var item1 = defaultWordNum;//100; //每頁字數
	var item2 = 0; //offset
	var item3 = $('#myvocColName0 option:selected').val(); //自訂查詢欄位1
	var item4 = $('#myvocCndtn0 option:selected').val(); //自訂查詢條件1
	var item5 = $('#myvocSrchStr0').val().trim(); //自訂查詢字串1
	var item6 = $('input[name=srchRelation]:checked').val();
	var item7 = $('#myvocColName1 option:selected').val(); //自訂查詢欄位2
	var item8 = $('#myvocCndtn1 option:selected').val(); //自訂查詢條件2
	var item9 = $('#myvocSrchStr1').val().trim(); //自訂查詢字串2
	
	if(item5 != ''){
		var panelType = localStorage.getItem("panelType");
		if(panelType=='vocLink3'){
			var item10 = '';
			var item11 = '';		
			tgtBuff = 'srchCstmCons';
		}else if(panelType=='vocLink4'){
			var item10 = 'vjDic';//$('#ltrOfDic option:selected').val();
			var item11 = $('#ltrSelector option:selected').val();;
			tgtBuff = 'srchTtlVocs';			
		}
		var buffVarAry = [item0, item1, item2, item3, item4, item5, item6, item7, item8, item9, item10, item11];
		var bAryLen = buffVarAry.length;
		buffStr = "";
		for (var i = 0; i < bAryLen; i++) {
			buffStr += buffVarAry[i] + ",";
		}	
		localStorage.setItem(tgtBuff, buffStr);
		vocSearch(panelType);
//$('#srchMsg').addClass('hidden');		
	}else{
		alert('請輸入查詢條件！');
	}
}
function consBck() {
	var panelType = localStorage.getItem("panelType");
	if(panelType=='vocLink3'){				
		tgtBuff = 'srchCstmCons';
	}else if(panelType=='vocLink4'){		
		tgtBuff = 'srchTtlVocs';			
	}
	//tgtBuff = 'srchCstmCons';
	var buffStr = localStorage.getItem(tgtBuff);
	var buffAry = buffStr.split(",");
	if (buffAry[0] != '') {
		$("#myvocOdr").val(buffAry[0]).attr('selected', true); //選單停在選定排序依據
	}
	if (buffAry[1] != '') {
		$("#myvoLmt").val(buffAry[1]).attr('selected', true); //選單停在選定每頁字數
	}
	if (buffAry[2] != '') {
		$("#myvocOfst").val(buffAry[2]).attr('selected', true); //offset
//alert('Page=>'+buffAry[2]);
	}
	if (buffAry[3] != '') {
		$("#myvocColName0").val(buffAry[3]).attr('selected', true); //選單停在查詢欄
	}
	if (buffAry[4] != '') {
		$("#myvocCndtn0").val(buffAry[4]).attr('selected', true); //選單停在查詢條件
	}
	if (buffAry[5] != '') {
		$('#myvocSrchStr0').val(buffAry[5]); //自訂查詢字串1
	}
	if (buffAry[6] != 'srchRel0') {
		$('#srchRelationAnd').attr('checked', 'checked');
	}
	if (buffAry[7] != '') {
		$("#myvocColName1").val(buffAry[7]).attr('selected', true); //選單停在查詢欄
	}
	if (buffAry[8] != '') {
		$("#myvocCndtn1").val(buffAry[8]).attr('selected', true); //選單停在查詢條件
	}
	if (buffAry[9] != '') {
		$('#myvocSrchStr1').val(buffAry[9]); //自訂查詢字串2
		//(".pnl2").removeClass("hidden");
		shwMyvocCstmQ2();
		$('#myvocCstmQ2').attr('checked', 'checked');
	}
}
function clrQ() {
	//alert("查詢結果已清除");
	//localStorage.setItem( 'srchCstmCons' , ",,,,,,,,,");
	//vocSearch('vocLink3');
}
function clrGo2idx() {				//回我的頁面	//目前沒使用
	var fnIfSuccess = function (data) {
		window.location.href = "userCenter.php";
	}
	callPhpFn('clrGo2idx', '', fnIfSuccess);
}
function checkCookie() { 			//檢查瀏覽器是否可用cookie
	var cookieEnabled = (navigator.cookieEnabled) ? true : false;
	if (typeof navigator.cookieEnabled == "undefined" && !cookieEnabled) {
		document.cookie = "testcookie";
		cookieEnabled = (document.cookie.indexOf("testcookie") != -1) ? true : false;
	}
	return (cookieEnabled);
}
function chgDic(_src, _voc, _windowType, _fnId){			//目前沒使用		
	/*var o=document.getElementById('dicPage');
	switch(dic){
		case 'dic1': o.src="https://tw.voicetube.com/definition/"+_voc; break;
		case 'dic2': o.src="http://dict.baidu.com/s?wd="+_voc;          break;
		case 'dic3': o.src="http://wap.iciba.com/cword/"+_voc;          break;
		case 'dic4': o.src="http://cdict.net/?q="+_voc;           		break;				
	}*/	
}	



function chgDic2(_src, _voc, _windowType, _fnId){//_fnId=0 是給builder用; _fnId=1是給myvoc速查用
	
	var dicNewWindow2;
	
	var newWindowLeft=0;
	var newWindowTop=0;
	if(_fnId == '0'){
		for(var i=0; i<11 ; i++){
			$('#dicBtn'+i).removeClass('dicChsn');
		}
		$('#dicBtn'+chsnDicNum).addClass('dicChsn');
		_voc = removePar(_voc);
		var srcStr="";	
		srcStr=_src + _voc;	
		if(_src=="https://translate.google.com/#en/zh-TW/"){
			//_voc=parent.jQuery("#editCaller").val("todayVoc");
			var exmp=$("#vocEx").val();
			if(exmp != "")_voc=exmp;
		}else if(_src=="http://tw.ichacha.net/"){
			srcStr=_src + _voc + ".html";
		}
		if(_windowType == "newWindow"){			
			if(window.screenY==0 && window.screenX==0){
				newWindowLeft=window.screenX + window.outerWidth/2 -600;
				newWindowTop =window.screenY + 157;
			}else{
				newWindowLeft=window.screenX + window.outerWidth/2 -600;
				newWindowTop =window.screenY + 174;			
			}
			dicNewWindow = window.open(srcStr, "name", "height=548,width=848, top="+newWindowTop+", left="+ newWindowLeft);
			dicNewWindow.close();
			dicNewWindow = window.open(srcStr, "name", "height=548,width=848, top="+newWindowTop+", left="+ newWindowLeft);
			
			//解決預設字典focus問題-不光彩的....
		}else{
			var o = document.getElementById('dicPage');
			o.src =srcStr;
		}

	}else if(_fnId == '1'){//1030,820
		var srcStr="";	
		srcStr=_src + _voc;	
		if(_src=="http://tw.ichacha.net/"){
			srcStr=_src + _voc + ".html";
		}		
		if(window.screenY==0 && window.screenX==0){
			newWindowLeft=window.screenX + window.outerWidth/2 -360;//600
			newWindowTop =window.screenY + 152;//157
		}else{
			newWindowLeft=window.screenX + window.outerWidth/2 -360;//600
			newWindowTop =window.screenY + 174;//174			
		}
		dicNewWindow2 = window.open(srcStr, "name", "height=545,width=1000, top="+newWindowTop+", left="+ newWindowLeft);
	}	
}
function chkAllData(_tableName){	//選取/取消全部資料	
	var selAll="";
	switch(_tableName){
		case "tracking":
			selAll  = "selAllTrack";
			chkHead = "behrChk";
			break;
	}
	if(selAll.checked==true){
		for(var i=0;i<100;i++){
			var k=document.getElementById( chkHead +i);
			if(k==null){
				break;
			}else{
				if(k.checked ==true){
					k.checked=false;
				}else{
					k.checked=true;
				}
			}	
		}
	}else{
		for(var i=0;i<100;i++){
			var k=document.getElementById( chkHead +i);
			if(k==null){
				break;
			}else{
				if(k.checked ==true){
					k.checked=false;
				}else{
					k.checked=true;
				}
			}	
		}
	}
}
function chkExist(_engStr){			//查英文字是否已存在，補空位
	//alert('chkExit');
	var numOfWord = 0;
	
	var fnIfSuccess = function (data) {
		alert(data);			
	}	
	callPhpFn('chkExist', _engStr, fnIfSuccess);	
	return numOfWord;
}
function checkIdleTime() {			//檢查是否待機過久
	var IDLE_TIMEOUT = 1800//30分鐘//單位是秒//lastActTimeOut 的時間也要調
	_idleSecondsCounter++;
	$('#idleTimer').text(_idleSecondsCounter);	
	var fnIfSuccess = function (data) {		
		//window.location.href = "index.php";
	}	
	if(_idleSecondsCounter >= IDLE_TIMEOUT){
		clearInterval(idleTimer);
		callPhpFn('killSelfSessionID', idleTimePage	, fnIfSuccess);
		idleTimerStopped	=	true;
	}	
}
function choseLastOri(){			//同上次出處
//aler("click");		
	$orgList = localStorage.getItem("orgList");
	if($orgList!=''){
		$ary     	=	$orgList.split('《§》');
		$vocOriStr	=	escapeStrBk($ary[0]);
		$('#vocOri').val($vocOriStr);
//alert($ary[0]);
		$('#choseLastOri').fadeOut(0);
	}
//alert('orgList=>' + $orgList);	
}


function dicToTop(){
//alert('dicToTop');
	if(dicNewWindow ){
		dicNewWindow.focus();
	}
	
}

function dRecClickID(id) {			//div id
	recClickID(id);
	//var userId="";
	var infoAry = [];
	infoAry[0] = localStorage.getItem("ip");
	var recStr = localStorage.getItem("behavior");
	localStorage.setItem("behavior", recStr);
	infoAry[1] = recStr;
	
	$.ajax({
		type : "POST",
		url : 'vocabPHPfn.php',
		async : true,
		data : {
			fnName : "viewerActRec",
			fnPar : infoAry
		},
		error : function (data) {
			//alert('ERROR');
		},
		success : function (data) {			

		}
	});
}
function delUser() {				//modal_刪除會員
	var i = 0;
	var idStr = "";
	var memType = "";
	while (document.getElementById('c' + i) != null) {
		memType = $('#m'+i+' option:selected').val();					
		//alert(memType);				
		if ($('#c' + i).is(":checked")) {
			if( memType=='vocab_user' || memType=='registered_user'){				
				idStr = idStr + ($("#voc" + i).text()).trim() + ",";
			}else{
				idStr = "";
				alert(memType);
				break;
			}
		}		
		i++;		
	}
	//alert("idStr= "+idStr);
	
	var fnIfSuccess = function (data) {
		//alert(data);
		if (data.trim() == 'success') {
			//$('#msgBox').modal('hide');
			pasteHtmlToDiv("memMngt", "rootForadmLink0", "");
		} else {
			//alert('Login unsuccessful! Please check your Account/Password.');
		}
	}
	callPhpFn('delUser', idStr, fnIfSuccess);
}
function delVoc(_type,	_ctr){		//顯示並更新刪除單字資訊//最終刪除在modal
//alert(_type+ " & "+_ctr);
	if(_type== 0){
		$('#vocAsMsg').text('刪除所有勾選單字？');
		$('#md_caller').val('batch');
	}else if(_type== 1){
		var eng		=	escapeStr( $('#vocEN'+_ctr).val() );
		var msgStr	= 	escapeStrBk('確認刪除 '+ eng + '?');
		$('#md_caller').val('single');
		$('#vocAsMsg').text(msgStr);
		$('#vocCtr').val(_ctr);	
	}		
}
function dicLtrOnChange(){
	var frstLtr = $('#ltrSelector option:selected').val();
	$('#myvocColName0, #myvocCndtn0, #myvocSrchStr0').addClass('hidden');	
	if(frstLtr=='All'){
		var col= $('#myvocColName0').val("colName0");
		var cnd= $('#myvocCndtn0').val("cndtn4");
		$('#myvocSrchStr0').val("jaskldfjskojua");
	}else if(frstLtr=='hide'){
		var col= $('#myvocColName0').val("colName5");
		var cnd= $('#myvocCndtn0').val("cndtn3");
		$('#myvocSrchStr0').val("1");
	}else{
		$('#myvocSrchStr0').val(frstLtr);
		var col= $('#myvocColName0').val("colName0");
		var cnd= $('#myvocCndtn0').val("cndtn1");			
	}
	//upDateVocTbl("ltrSelector");
	//cstmSrch();	
}
function dxLogin(_id){				//切換會員帳號登入
	localStorage.clear();
	var fnIfSuccess = function (data) {
//alert(data);
		$cookieChk = checkCookie();
		if ($cookieChk == true) { //檢查瀏覽器是否可用cookie
			if (data.trim() == 'fail') {
				alert('帳號或密碼錯誤');				
			} else {
				//window.location.href = "userCenter.php";
				window.location.reload();
			}
		} else {
			alert('請開啟瀏覽器cookie功能！');
		}	
	}	
	callPhpFn('dxLogin', _id, fnIfSuccess);
}
function dLogin(_id) {				//首頁快速登入
	localStorage.clear();
//alert('Login id=> '+_id);
	var fnIfSuccess = function (data) {
//alert(data);
		$cookieChk = checkCookie();
		if ($cookieChk == true) { //檢查瀏覽器是否可用cookie
			if (data.trim() == 'fail') {
				alert('帳號或密碼錯誤');				
			} else {
				window.location.href = "userCenter.php";
			}
		} else {
			alert('請開啟瀏覽器cookie功能！');
		}
	}	
	callPhpFn('dLogin', _id, fnIfSuccess);	
}
function escapeStr(_str){			//替換字串中奇怪符號
	var str1= _str.replace(/'/g,"╪");
	str1= str1.replace(/"/g,'┴');
	str1= str1.replace(/\|\/|\{|\}|\\/g,"└");//替換這些符號:   /   \   {  }  `
	str1= str1.replace(/`/g,"♀");
	str1= str1.replace(/ˈ/g,"╪");
	str1= str1.replace(/\./g,"⊙");
	//str1= str1.replace( chr(13), " ");
	return str1;
}
function escapeStrBk(_str){			//還原怪符號,部分符號改為空白
	if( _str ){
		var str1= 	_str.replace(/╪/g	,"'")	;//還原單引號
		str1	=	str1.replace(/┴/g	,'"');//還原雙引號	
		str1	=	str1.replace(/♀/g	,"`");		
		str1	=	str1.replace(/⊙/g	,".");	
		str1	=	str1.replace(/♂/g	,"/");
		str1	=	str1.replace(/⊕/g	,":");
		str1	=	str1.replace(/╨/g	,"\n");//換行符號
		str1	=	str1.replace(/└/g	,"");
		//str1=str1.replace(/╪/g	,"'")	;
		//var str00=$vocEx.replace(/【/g,"");
		//var str0=str00.replace(/】/g,"");
		//str1=str1.replace(/㊣/g,'');//還原單引號
		return str1;
	}else{
		return "";
	}	
}
function escapeStrBk2(_str){		//還原單雙引號,其他符號改為空白
	var str1=_str.replace(/㊣/g,"'");	
	return str1;
}
function editMove(_upOrDown){
	//editCtr在按下編輯鈕時提供給全域變數
	var tgtCtr=0;	
	if(_upOrDown=='up'){
		tgtCtr = parseInt(editCtr)-1;
	}else if(_upOrDown=='down'){
		$("#editCaller").val("editor");
		tgtCtr = parseInt(editCtr)+1;
	}
	tgtCtr = tgtCtr.toString();	
//alert('Ctr=> ' + tgtCtr +' & vStr=>' + vInfoStr);	
	if($('#vInfo'+tgtCtr).length){
		var vInfoStr = $('#vInfo'+tgtCtr).val();
		editVoc(vInfoStr, tgtCtr);
	}else{
		alert("這是最後一個字，請至我的字庫換頁");
	}	
}
function editVoc(vocInfoStr, _ctr){	//myvoc編輯鈕
//alert('alert=>'+vocInfoStr);
//$vocInfoAry=['eng', 'chn','kk', 'pos', 'note', 'exmp', 'origin', 'id', 'tags'];
//alert('strIn=>'+vocInfoStr);
	editCtr	=	_ctr;
	$('#bldrCover').addClass('hidden');
	var vocInfoAry = vocInfoStr.split("《§》");	
	if(isNumbered(vocInfoAry[0])){
		var leftBktPos  = vocInfoAry[0].indexOf("(");
		var rightBktPos = vocInfoAry[0].indexOf(")");
		engStr      = vocInfoAry[0].slice(0,leftBktPos);
		var numStr      = vocInfoAry[0].slice(leftBktPos+1,vocInfoAry[0].length);
		vocInfoAry[0]	= engStr;
		bracketNum   	= parseInt(numStr);
		if(numStr.slice(0,1)=='N'){
			$('#bktNum').html("");	
		}else{
			$('#bktNum').html("(" + bracketNum +")");
			$('#bktNum').removeClass('hidden');				
		}
	}else{
		$('#bktNum').addClass('hidden');
	}
	go2Front('link1');
	$('#choseLastOri').fadeOut(0);	
	vocInfoAry[2]= kkBracket(vocInfoAry[2]);	
	vocInfoAry[3]= posBracket(vocInfoAry[3]);
	var pkgCodeAry=["BA_00", "BA_01", "BA_02", "ME_01", "ME_02", "ME_03", "AD_01", "AD_02", "AD_03", "TE_01", "TE_02", "TE_03", "TF_01", "TF_02", "TF_03", "TF_04", "TF_05", "GR_01", "GR_02", "GR_03", "GR_04", "GR_05", "GR_06", "GR_07", "GR_08", "TR_01", "TR_02", "TR_03", "TR_04", "TR_05", "TR_06", "TR_07", "TR_08", "TR_09"];	
	var pkgNameAryLen = pkgCodeAry.length;
	var isPkg=false;
	for(var j = 0; j < pkgNameAryLen; j++){
		if(vocInfoAry[6]== pkgCodeAry[j]){
			$('#pkgCover').val($('#orgName'+_ctr).text());
			$('#pkgCover').removeClass('hidden');
			isPkg=true;
			break;
		}
	}	
	if(!isPkg){$('#pkgCover').addClass('hidden');}
	for(var i=0; i<bldrAryLen;i++){		
		document.getElementById(bldrAry[i]).value = escapeStrBk (vocInfoAry[i]);
	}
	$("#editCaller").val("myvoc");
	srchDef();
//alert("cookie orgEng: " + vocInfoAry[0]);
	doCookieSetup('orgEng',removePar(vocInfoAry[0]));//存英文單字在JS cookie供後續比對英文有無異動用
}
function editAlert(_type){
	/*if(_type==1){
		$('#addAnoVoc , #cxlAddAnoVoc').css('background','red');	
	}else if(_type==2){
		$('#addAnoVoc , #cxlAddAnoVoc').css('background','gray');
	}*/
	//alert('Builder cover Activated. Type=_'+_type);
//$('#haveThisVoc').modal();
	
	
	
	
	
}
function fbRegFn(_fnPar){			//FB註冊用
	var rInfoAry = [];
	rInfoAry[0]	=_fnPar[0];
	rInfoAry[1]	= 'hello';//***********************
	rInfoAry[2]	=_fnPar[1];
	rInfoAry[3] = '0';
	if(localStorage.getItem("country")=='tw'){
		rInfoAry[3] = '1';
	}
	rInfoAry[4] = "fb";
	rInfoAry[5] = localStorage.getItem("country");
	rInfoAry[6] = localStorage.getItem("hrDiff");
//alert(_fnPar[0]);
	var fnIfSuccess = function (data) {
//alert('Reg:'+data);
		if (data.trim() != 'fail') {
			//window.location.href = "userCenter.php";
			location.reload();
		}	
	}
	callPhpFn('reg', rInfoAry, fnIfSuccess);		
}
function flipLog(){					//日誌表頭日期下拉選單
	//alert('hell');
	var logYearVal	=	$('#logYear option:selected').val();
	var logMonthVal =	$('#logMonth option:selected').val();
//alert(logYearVal+'__'+logMonthVal);
	logSrch([logYearVal, logMonthVal]);
	global_flipLogYear  = logYearVal;
	global_flipLogMonth = logMonthVal;
}
function flipByBtn(btnName){
	var fnIfSuccess = function (data) {
		if(data.trim()=='沒cookie'){
			//showCookieExpiredModalAndLogout();
		}else{
			flipByBtn_part2(btnName);
		 }
	 }
	callPhpFn('chkCookie', '', fnIfSuccess);
}
function flipByBtn_part2(btnName) {
	//alert('btnName= '+ btnName);
	var pageNum = midNum($('#myvocOfst option:selected').text(), 1, 2);
	var maxPage = parseInt($("#ttlPages").text());
	var flip=true;
	switch (btnName) {
	case 'first':
		pageNum = 1;
		break;
	case 'next':
		if (pageNum < maxPage) {
			pageNum += 1;
		}
		break;
	case 'prev':
		if (pageNum > 1) {
			pageNum -= 1;
		}
		break;
	case 'last':
		pageNum = maxPage;
		break;
	}
	if(flip){
		$('#myvocOfst option:selected').text('第' + pageNum + '頁');
		upDateVocTbl("flipper");
	}
}
function formPwFgtCnfm(){			//忘記密碼
	var acct = $('#vEmail').val();	
	var fnIfSuccess2 = function (data) {
		alert(data);									
	}	
	var fnIfSuccess = function (data) {
		if(data==1){
			//alert('寄信_'+data);
			$('#formPwFgt').hide();
			$('#loginBtn').show();
			callPhpFn('pwdFgtEmail', acct, fnIfSuccess2);			
		}else{
			//alert('帳號不存在_'+data);
			alert('您輸入的帳號: ' + escapeStrBk(acct) + ' ，系統無相符資料，請重新輸入。');
			//$('#vEmail').val("");
			setTimeout(function(){$('#vEmail').focus();},0);
		}										
	}		
    if( isEamil(acct) ){//驗證email格式
		//alert('pass');
		acct	=	escapeStr(acct);
//alert(acct);
		callPhpFn('accountExist', acct, fnIfSuccess);	
	}else{
		alert('您輸入的帳號: ' + escapeStrBk(acct) + ' ，系統無相符資料，請重新輸入。');
	}		
}
function focusBlur(_tgtId){			//暫時停用
	/*if(event.which == 13) {
		$('#'+_tgtId).blur();		
	}*/	
}
function formBehvr(btnId){			//控制首頁表單出現行為
	switch(btnId){		
		case 'btnReg':        $('#formLogin').hide(); $('#formReg').show(); break;
		case 'btnPwFgt':      $('#formLogin').hide(); $('#formPwFgt').show(); break;
		case 'formLoginCxl':  $('#formLogin').hide(); $('#loginBtn').show(); break;
		case 'formRegCxl':    $('#formReg').hide(); $('#loginBtn').show(); break;
		case 'formPwFgtCxl':  $('#formPwFgt').hide(); $('#loginBtn').show(); break;			
		case 'formLoginCnfm': $('#formLogin').hide(); $('#loginBtn').show(); break;
		case 'formRegCnfm':   $('#formReg').hide(); $('#loginBtn').show(); break;
		case 'formPwFgtCnfm': formPwFgtCnfm(); break;			
	}	
}
function getENvalue(){				//取得英文欄位的值
	/*engBfSuff		=	document.getElementById('vocEN').value;
	var listValue	=	document.getElementById("vocENList").value;	
	$('#vocEN').val(listValue);	*/
	var englistVal=$("#vocENList").val();
	if(englistVal!='(變化字尾)'){
		$("#vocEN").val(englistVal);
	}
	
}
function getSelectionStart(o) {
	if (o.createTextRange) {
		var r = document.selection.createRange().duplicate()
		r.moveEnd('character', o.value.length)
		if (r.text == '') return o.value.length
		return o.value.lastIndexOf(r.text)
	} else return o.selectionStart
	
}
function getVocPoS(){
	var vocPoS=$('#vocPoS').val();
//alert('vocPoS=>'+vocPoS);
	if(vocPoS!='(詞性)'){
		$('#vocPOStxt').val(vocPoS);
	}else{
		$('#vocPOStxt').val('');
	}	
}
function go2Page(_tgt){
	//alert('click: '+_tgt);
	switch(_tgt){
		case 0: go2Front('pakLink0'); break;
		case 1: go2Front('link1')   ; break;
	}
}
function go2Front(linkId){			//go2Front
	var fnIfSuccess = function (data) {
//alert(data);
		if(data.trim()=='沒cookie'){
			//showCookieExpiredModalAndLogout();
		}else{
			go2Front_part2(linkId);
		}
	 }
	callPhpFn('chkCookie', '', fnIfSuccess);
}
function go2Front_part2(linkId) {	//go2Front_part2	
//alert('linkId=>'+linkId);
	for(var i=0; i<8; i++){linkHover(0, 'link'+i);}
	if(linkId=="pakLink0"){
		linkHover(1, "link4");
	}else if(linkId=="admLink0" || linkId=="admLink1" || linkId=="admLink2"){
		linkHover(1, "link5");
	}else if(linkId=="vocLink0" || linkId=="vocLink1" || linkId=="vocLink2" || linkId=="vocLink3" || linkId=="vocLink4"){
		linkHover(1, "link2");
	}else {
		linkHover(1, linkId);
	}	
	rootDisplay(linkId);
	
	if($('#cntrBody').hasClass('hideScroll')){
		$('#cntrBody').removeClass("hideScroll");
	}
	if($('#cntrBody').hasClass('hideXScroll')){
		$('#cntrBody').removeClass("hideXScroll");
	}	
	if(linkId=="link0" || linkId=="link1" ){
		$('#cntrBody').addClass("hideScroll");
	}else{// if(linkId=="link2" || linkId=="link3" || linkId=="link4" || linkId=="link6"){
		$('#cntrBody').addClass("hideXScroll");
	}
	var fnIfSuccess = function (data) {
		document.getElementById('rootFor' + linkId).innerHTML = data;
				
		if(localStorage.getItem("lang")=='chs'){tongwen_TtoS();}	
		//if($(".tMov")[0]){ $(".tMov").hide();}//預設教學影片hide
	}
	if ($('#rootFor' + linkId).hasClass('epty')) {
		$('#rootFor' + linkId).removeClass('epty');		
		switch (linkId) {			
			case "link0": //遊樂中心
				pasteHtmlToDiv('game', 'rootFor' + linkId, '');				
				//$('#rootForlink0').addClass('hidden');			
				break;
			case "link1": //新增單字//開啟builder
				builder('refresh');
				break;
			case "link2": //我的字庫		
				vocSearch('vocLink0');
				break;
			case "link3": //學習日誌
				logSrch('');
				break;
			case "link4": //購物中心//目前沒用，已改用字庫安裝-pakLink0
				break;
			case "link6": //新手教學
				callPhpFn('tutorial', '', fnIfSuccess);
				break;
			case "link7": //實用資源
				callPhpFn('memResource'	, '', fnIfSuccess);
				break;
			case "link8": //會員升級
				callPhpFn('memUpgrd'	, '', fnIfSuccess);
				break;
			case "admLink0": //會員管理
				var vjmm0	=	$('#vjmm0').text().trim();//col				
				var vjmm1	=	$('#vjmm1').text().trim();//lmt
				if(getCookie('vjLmt')){
					vjmm1=	getCookie('vjLmt');
				}				
				var vjmm2	=	$('#vjmm2').text().trim();//ofst			
				var vjmm3	=	$('#vjmm3').text().trim();//memType
				var vjmm4	=	$('#vjmm4').text().trim();//sort
				if(getCookie('vjSrt')){
					vjmm4=	getCookie('vjSrt');
				}				

				var fnPar	=	[vjmm0, vjmm1, vjmm2, vjmm3, vjmm4];			
				pasteHtmlToDiv('memMngt', 'rootFor' + linkId, fnPar);
//pasteHtmlToDiv('admVerification', 'rootFor' + linkId, ['','','m']);				
				break;
			case "admLink1": //全站單字
				break;
			case "admLink2": //Tracking
//pasteHtmlToDiv('admVerification', 'rootFor' + linkId, ['','','t']);
				pasteHtmlToDiv('tracking', 'rootFor' + linkId, '');//admLink2
				break;
			case "admLink3": //試玩紀錄
				pasteHtmlToDiv('gmTrailRec', 'rootFor' + linkId, '');//admLink2	
				break;	
			case "pakLink0": //已安裝字庫////字庫安裝
				var pakCaller = localStorage.getItem("pakCaller");	
				if(pakCaller == '0'){
					pasteHtmlToDiv('allPaks', 'rootForpakLink0', 'user');
				}else{
					pasteHtmlToDiv('allPaks', 'rootForpakLink0', 'all');
				}
				$('#rootFor' + linkId).addClass('epty');
				break;
		}
	}else if(linkId=='link3'){
		logSrch('');
	}	
	recClickID(linkId);
	resizeVJFooter(linkId);	
}
function goToFB(){	
	window.location.href = "https://www.facebook.com/vocabjet";
}
function getOrgList(){				//get orgList from user_center
	$('#vocOriSel option[value!=""]').remove();//remove option
	$orgList=localStorage.getItem("orgList");	
	$ary=$orgList.split('《§》');
	addOption('vocOriSel','(未定義)');
	if($ary[0]!='undefined'){
		for(var i=0;i<6;i++){
			addOption('vocOriSel',$ary[i]);
		}	
	}	
}
function getTgtBuffName(_caller){	//回傳localStorage的名字
	switch (_caller) {
		case 'link2'   :	tgtBuff = 'srchAllCons';	  break;
		case 'vocLink0':	tgtBuff = 'srchAllCons';	  break; //全部單字
		case 'vocLink1':	tgtBuff = 'srchUsrBdCons';    break; //自建單字
		case 'vocLink2':	tgtBuff = 'srchVjPkgCons';    break; //本站單字
		case 'vocLink3':	tgtBuff = 'srchCstmCons';	  break; //自訂查詢
		case 'vocLink4':	tgtBuff = 'srchTtlVocs';	  break; //全站單字
		//case 'btnMyvocCstmQ':	tgtBuff = 'srchCstmCons'; break; //自訂查詢
	}
	return tgtBuff;
}
function getIp() {
	$.get("http://ipinfo.io", function (response) {
		ip = response.ip;
		city = response.city;
		region = response.region;
		country = response.country;
		localStorage.setItem("ip", ip);
		localStorage.setItem("city", city);
		localStorage.setItem("region", region);
		localStorage.setItem("country", country);
	}, "jsonp");
}
function go2idx() {					//回首頁--目前沒使用
//alert('go2idx');
	/*var fnIfSuccess = function (data) {
		window.location.assign("index.php");
	}
	callPhpFn('go2idx', '', fnIfSuccess);*/
}
function hideMyvoc(_srcNum , _ctr){	//src=>1 myvoc, 2 vjDic
	var tgtId = "";	
	var vocId = "";
	var _colName = 'hide';
	var fnIfSuccess = function (data){		
//alert(data);
		retainSamePg(1);		
	}
	if(_srcNum==1){//myvoc隱藏
		tgtId = '#vocId';
		vocId = $( tgtId + _ctr).val();
		callPhpFn('updateCol', [vocId, _colName, '1'], fnIfSuccess);	
	}else if(_srcNum==2){//vjDic隱藏
		tgtId = '#vjDicId';//vjDicVocId
		vocId = $( tgtId + (_ctr-2) ).val();
		callPhpFn('updateColBatchVjDic', [_colName, '1', vocId], fnIfSuccess);
	}else if(_srcNum==3){//vjDic隱藏還原
		tgtId = '#vjDicId';//vjDicVocId
		vocId = $( tgtId + (_ctr-2) ).val();
		callPhpFn('updateColBatchVjDic', [_colName, '0', vocId], fnIfSuccess);
	}else if(_srcNum==4){//myvoc隱藏還原
		tgtId = '#vocId';
		vocId = $( tgtId + _ctr).val();
		callPhpFn('updateCol', [vocId, _colName, '0'], fnIfSuccess);
	}
//alert(_srcNum+" & "+ _ctr +" & "+ vocId);	
}
function hrDiffToCookies(){			//算時差，存cookies
	var d = new Date();
	var n = d.getTimezoneOffset();
	var hrDiff= (n/60)*-1;//14;//(-1*n)/60;
	localStorage.setItem("hrDiff", hrDiff);
//alert(localStorage.getItem("hrDiff"));
	var fnIfSuccess = function (data) {
//alert('offset=>'+n +'\n'+data);
	}	
	callPhpFn('hrDiffToCookies', hrDiff, fnIfSuccess);	
	//tw =-480 ==>0 //+8 UTC
	//us = 240 ==>12 + 2	//240= -5 UTC	
	//Math.round(new Date(item5).getTime()/1000)//js string to php timestamp
}
function idTranslate(_id){			//tracking id轉中文 
	var idStr="";
	switch(_id){
		case "link0":         idStr="遊樂中心"; break;			
		case "link1":         idStr="新增單字"; break;			
		case "link2":         idStr="我的字庫"; break;			
		case "link3":         idStr="學習日誌"; break;			
		case "link4":         idStr="購物中心"; break;
		case "link6":         idStr="使用說明"; break;	
		case "link7":         idStr="實用資源"; break;			
		case "admLink0":      idStr="會員管理"; break;			
		case "admLink1":      idStr="全站單字"; break;		
		case "admLink2":      idStr="Tracking"; break;		
		case "vocLink0":      idStr="全部單字"; break;			
		case "vocLink1":      idStr="自建單字"; break;			
		case "vocLink2":      idStr="本站單字"; break;			
		case "vocLink3":      idStr="自訂查詢"; break;		
		case "vocLink4":      idStr="全站單字"; break;		
		case 'btnReg':        idStr="註冊";     break;
		case 'btnPwFgt':      idStr="忘記密碼"; break;
		case 'formLoginCxl':  idStr="取消登入表單"; break;
		case 'formRegCxl':    idStr="取消註冊表單"; break;
		case 'formPwFgtCxl':  idStr="取消忘記密碼"; break;			
		case 'formLoginCnfm': idStr="登入確認"; break;
		case 'formRegCnfm':   idStr="註冊確認"; break;
		case 'formPwFgtCnfm': idStr="重送密碼"; break;
		case 'loginOrReg':    idStr="登入或註冊"; break;
		case 'fbLogin':       idStr="FB登入"; break;
		case 'cxlRegForm':    idStr="取消註冊表單"; break;
		case 'cxlLoginForm':  idStr="取消登入表單"; break;
		case 'login':         idStr="登入確認"; break;
		case 'trial':         idStr="試玩"; break;
		case 'regForm':       idStr="註冊表單"; break;
		case 'fbReg':         idStr="FB註冊"; break;
		case 'fgtPwdForm':    idStr="忘記密碼表單"; break;
		case 'reg':           idStr="註冊確認"; break;
		case 'sndFgtPwRqst':  idStr="重送密碼"; break;
		case 'cxlFgtPwForm':  idStr="取消重送密碼"; break;
		case 'vocENList':     idStr="去字尾"; break;
		case 'vocPoS':        idStr="詞性"; break;
		case 'vocOriSel':     idStr="出處"; break;
		case 'choseLastOri':  idStr="同上次出處"; break;
		case 'buildBtn_enter':idStr="存單字"; break;
		case 'btnSearch':     idStr="查單字"; break;
		case 'vocKKsym':      idStr="KK鍵盤"; break;
		case 'buildBtn_previousEx':  idStr="上次例句"; break;
		case 'buildBtn_parenthesis': idStr="生字框"; break;
		case 'buildBtn_clear':       idStr="清除"; break;
		default:                     idStr=_id;		
	}
	return idStr;
}
function isNumbered(_eng){
	var chkRslt=false;	
	var pattern = /\(/g;
	chkRslt= pattern.test(_eng);
	return chkRslt;
}
function isDbl($en,$num){			//檢查「英文單字區」有無重複字尾（給下拉選項用）
	var result=false;
	var k=$en.substr($en.length-$num,2);
	if(k=='bb' || k=='dd' || k=='gg' || k=='kk' || k=='mm' || k=='nn' || k=='pp' || k=='rr' || k=='tt'){
		result=true;
	}	
	return result;
}
function isEamil(_email){			//檢查是否符合email格式
	var isEamil = false;
	var pattEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	isEamil = pattEmail.test(_email);
	return isEamil;
}
function kkFocus(){
	if($('#vocKK').is(':focus')){
		var o = document.getElementById('vocKK');
		var selStart = getSelectionStart(o);
		localStorage.setItem("kkFocused", "true");
		localStorage.setItem("kkLPos", selStart);
	}else{
		localStorage.setItem("kkFocused", "false");
	}
}
function kkBracketNow(){
	var o 			= 	document.getElementById('vocKK');
	var selStart	=	getSelectionStart(o);
	var orgKkStr 	= 	$('#vocKK').val();
	$('#vocKK').val( kkBracket( orgKkStr ) );
	o.setSelectionRange( selStart, selStart );
}
function kkBracket(_orgStr){
//alert('helloIN=> '+_orgStr);
	if( _orgStr ){
		var newStr = _orgStr.replace(/[\[\]\/]/g,'');
		if( newStr != "" ){ newStr = "[" + newStr.trim() + "]"; }
		return newStr;
	}else{
		return "";
	}	
}
function kickOnlineUser(){			//踢掉沒cookie的用戶//目前沒使用
	/*var limit    = 6000*60*24*30;//一個月;
	var waitTime = 6000*60;//一小時執行乙次//單位:秒
	
	var fnIfSuccess = function (data) {
		limit = limit - waitTime;
		if(data.trim()=='沒cookie'){
			//showCookieExpiredModalAndLogout();		
		}
	}	
	var timer = setInterval(function () {
		if (limit > 0) {			
			callPhpFn('chkCookie', '', fnIfSuccess);			
		}else{			
			//showCookieExpiredModalAndLogout();
		}
	}, waitTime);*/
}
function posBracket(_poStr){		//去除詞性原有括弧，顯示時才補上括弧
	var _poStr = _poStr.replace(/[\[\]\/\【\】]/g,'');
	/*var _poStr	= _poStr.replace('['	, '');
	_poStr 		= _poStr.replace(']'	, '');
	_poStr 		= _poStr.replace('【'	, '');
	_poStr 		= _poStr.replace('】'	, '');*/	
	if(_poStr != ""){	_poStr="【"+ _poStr +"】"; }
	return _poStr;
}
function logout() {
//alert('logout click');
	localStorage.clear();//清除localStorage		
	var fnIfSuccess = function (data) {
//alert(data);
		//window.location.reload();
		window.location.href = "index.php";
	}
	callPhpFn('logout', '', fnIfSuccess);
}
function login() {
//alert('login');
	var vloginAry = [];
	var fnIfSuccess = function (data) {
//alert(data);
		$cookieChk = checkCookie();
		if ($cookieChk == true) { //檢查瀏覽器是否可用cookie
			if (data.trim() == 'fail') {
				alert('帳號/密碼錯誤或是帳號尚未啟用！');
			}else if(data.trim() == 'useFBLogin'){
				alert('這個帳號採用FB註冊，請使用FB登入！');
			}else{
				//window.location.reload();
				window.location.href = "userCenter.php";
			}
		} else {
			alert('請開啟瀏覽器cookie功能！');
		}
	}
	for (var i = 0; i < 2; i++) {
		vloginAry[i] = $('#vlogin' + i).val();
	}
	if ($('#vlogin2').is(":checked")) {
		vloginAry[2] = '1';
	} else {
		vloginAry[2] = '0';
	}	
	vloginAry[3] = 'regBtn';
//alert(vloginAry[0]+"\n"+vloginAry[1]+"\n"+vloginAry[2]);
	if (vloginAry[0] != '' && vloginAry[1] != '') {
		callPhpFn('login', vloginAry, fnIfSuccess);
	} else {
		alert('請輸入電子郵件及密碼。');
	}
}
function loginEnterKey() {
	if (event.which == 13) {
		var eAcct = $('#vlogin0').val();
		var ePwd = $('#vlogin1').val();
		if (eAcct != "" && ePwd != "") {
			login();
		}
	}
}
function loginOrRegBtn(){			//首頁登入或註冊按鈕
	recClickID('i5'); 
	pasteHtmlToDiv('formLogin', 'formArea', ''); 
	$('#loginBtn').hide();
}
function loadDicToLocal(){			//取得字典陣列
	//var defaultDic	=	'2';//愛詞霸
	//字典名=>defaultDic*3+1
	//網址	=>defaultDic*3+2
	//視窗	=>defaultDic*3+3
}
function loader() {
	var opts = {
		lines : 13 // The number of lines to draw
	,
		length : 7 // The length of each line
	,
		width : 29 // The line thickness
	,
		radius : 64 // The radius of the inner circle
	,
		scale : 0.25 // Scales overall size of the spinner
	,
		corners : 1 // Corner roundness (0..1)
	,
		color : '#000' // #rgb or #rrggbb or array of colors
	,
		opacity : 0.35 // Opacity of the lines
	,
		rotate : 0 // The rotation offset
	,
		direction : 1 // 1: clockwise, -1: counterclockwise
	,
		speed : 1 // Rounds per second
	,
		trail : 60 // Afterglow percentage
	,
		fps : 20 // Frames per second when using setTimeout() as a fallback for CSS
	,
		zIndex : 2e9 // The z-index (defaults to 2000000000)
	,
		className : 'spinner' // The CSS class to assign to the spinner
	,
		top : '50%' // Top position relative to parent
	,
		left : '50%' // Left position relative to parent
	,
		shadow : false // Whether to render a shadow
	,
		hwaccel : false // Whether to use hardware acceleration
	,
		position : 'absolute' // Element positioning
	}
	var target = document.getElementById('loader')
		var spinner = new Spinner(opts).spin(target);
}
function logSrch(fnPar){
	var t = new Date();
	var tYear  = t.getFullYear();
	var tMonth = t.getMonth()+1;
	var searchYear;
	var searchMonth;
	//global_flipLogYear = tYear;
	//global_flipLogMonth= tMonth;	
	if(fnPar==""){
		searchYear =tYear;
		searchMonth=tMonth;
	}else{
		searchYear =fnPar[0];
		searchMonth=fnPar[1];
	}
	var fnIfSuccess2 = function (data) {
		document.getElementById('rootForlink3').innerHTML =data;		
		if(localStorage.getItem("lang")=='chs'){tongwen_TtoS();}
setWinHeight2("whiteBackLog", "logList");
		//showChrt();	
		if(fnPar==""){
			$("#logYear").val(tYear).attr('selected', true);		
			$("#logMonth").val(tMonth).attr('selected', true);				
		}else{
			$("#logYear").val(global_flipLogYear).attr('selected', true);		
			$("#logMonth").val(global_flipLogMonth).attr('selected', true);
		}
		//alert("month on Page" + $("#logMonth").val());
		if($("#logYear").val()== tYear && $("#logMonth").val()== tMonth){
			$('#nxtMonth').prop("disabled",true);
		}
		var regYear=localStorage.getItem("regYear");
		var regMonth=localStorage.getItem("regMonth");
		if(regYear<=2015){regYear=2015; regMonth=1;}
		if($("#logYear").val()== regYear && $("#logMonth").val()== regMonth){
			$('#preMonth').prop("disabled",true);
		}
		
//alert(global_flipLogYear+'年'+global_flipLogMonth+'月');
	if(global_flipLogYear){
		$('#cloneYear').text(global_flipLogYear);
		$('#cloneMOnth').text(global_flipLogMonth);
	}else{
		$('#cloneYear').text(tYear);
		$('#cloneMOnth').text(tMonth);
	}

		
	}
	var fnIfSuccess = function (data) {
//alert(data);
		callPhpFn('mylog', [searchYear, searchMonth, tYear, tMonth] , fnIfSuccess2);	
	}
	callPhpFn('updateLog', '' , fnIfSuccess);//fnVar暫時沒給	
}
function langChkMod(){				//切換首頁網頁語言字體
	var lang= parseInt($('#langVal').text());
	if(lang==0){
		localStorage.setItem("lang", "chs");		
		$('#langVal').text('1');
	}else if(lang==1){ 
		localStorage.setItem("lang", "cht");
		$('#langVal').text('0');
	}
	TS_Switch();	
}
function langSetter(){				//用IP地理位置設定用戶語言
	if(typeof(Storage) !== "undefined") {
		if(localStorage.getItem("lang")== null ){
			if(localStorage.getItem("country")==null){
				localStorage.setItem("lang", "cht");
			}else{
				if(localStorage.getItem("country")=='TW'){
					localStorage.setItem("lang", "cht");
				}else if(localStorage.getItem("country")=='US'){
					localStorage.setItem("lang", "cht");
					TS_Switch();	
				}else{					
					if($("#ts").length != 0) {//"id" exists
						document.getElementsByClassName('ts').innerHTML='简繁切換';						
					}
					localStorage.setItem("lang", "chs");
					TS_Switch();					
				}
			}			
		}else{
			localStorage.setItem("lang", "cht");
		}
	}
}
function linkHover(onOrOff, _tgtId){
	if (onOrOff == 1){
		$('#'+_tgtId).addClass('usrLinkHover');
	}		
	if (onOrOff == 0){		
		$('#'+_tgtId).removeClass('usrLinkHover');
	}
}
function linkScroll(_obj){			//超連結捲動效果-實用資源頁
	$('html, body').animate({scrollTop: $(_obj).offset().top - 50 },500);
	return false;//防止畫面閃動			
}
function moveLogMonth(upOrDown){	//日誌表頭-上、下月按鈕切換
	var t = new Date();
	var tYear  = t.getFullYear();
	var tMonth = t.getMonth()+1;
	var logYearVal  = parseInt($('#logYear option:selected').val());
	var logMonthVal = parseInt($('#logMonth option:selected').val());
	
	
	
	if(upOrDown==1){//按下個月
		if(logYearVal <= tYear){
			if(logMonthVal<12){
				logMonthVal = parseInt(logMonthVal) + 1;
			}else{
				logMonthVal=1;
				logYearVal	= parseInt(logYearVal) + 1;
			}
		}
	}else if(upOrDown==0){//按上個月
		if(logYearVal<=tYear){
			if(logMonthVal>1){
				logMonthVal = parseInt(logMonthVal) - 1;
			}else if(logYearVal>2014){
				logMonthVal=12;
				logYearVal	= parseInt(logYearVal) - 1;							
			}
		}		
	}else{
		logYearVal=tYear;
		logMonthVal=tMonth;
	}
	$("#logYear").val(logYearVal).attr('selected', true);
	$("#logMonth").val(logMonthVal).attr('selected', true);
	flipLog();
}
function mrktScroll(_obj){			//字庫管理頁面滾動//若GRE是最後一個，增加一個row對齊
	if(_obj=='#greBar'){
		$('#fakeRow').removeClass('hidden');
	}else{
		$('#fakeRow').addClass('hidden');
	}
	$('html, body').animate({scrollTop: $(_obj).offset().top - 50 },500);
	return false;//防止畫面閃動	
}
function mkBoxAconfirm(){			//按下字庫管理頁面，modal確定鈕後的行為
	var actType = $('#mkBoxA_buff_0').val();
//alert('actType=>'+actType);
	
	var fnIfSuccess = function (data) {
//alert(data);
		var defaultWordNumQ = localStorage.getItem('defaultVocPerPage');
		switch(defaultWordNumQ){
			case '0': defaultWordNum='20' ; break;
			case '1': defaultWordNum='50' ; break;
			case '2': defaultWordNum='100'; break;
		}				
		localStorage.setItem('srchAllCons'   , 'odr1,'+defaultWordNum+',0,,,,,,,,,');//若localstorage沒有值，此處給初始值
		//************************************************
		$('#rootForlink2').addClass('epty');//更新檢視字庫頁面
		go2Front('pakLink0');		
	}
	
	if(actType =='purchase'){// mkBoxA_buff_1 是字庫代碼
		callPhpFn('pakManage', ['purchase'	, $('#mkBoxA_buff_1').val()], fnIfSuccess);
	}else if(actType =='uninstall'){
		callPhpFn('pakManage', ['uninstall'	, $('#mkBoxA_buff_1').val()], fnIfSuccess);
	}else if(actType =='install'){
		callPhpFn('pakManage', ['install'	, $('#mkBoxA_buff_1').val()], fnIfSuccess);
	}else if(actType =='remove'){
		callPhpFn('pakManage', ['remove'	, $('#mkBoxA_buff_1').val()], fnIfSuccess);
	}else if(actType =='suspend'){
		callPhpFn('pakManage', ['suspend'	, $('#mkBoxA_buff_1').val()], fnIfSuccess);
	}
}


function retainSamePg(_numOfDelHideRestoreVoc){			//刪除後留在原本頁面不跳頁
	var tgtId='myvocTdNum';
	if(localStorage.getItem("panelType")=='vocLink4'){
		tgtId='vjDicTdNum';
	}
	tempOffset  = ( parseInt( $('#'+ tgtId + '0').text())-1);
	upDateVocTbl('myvocOfst');		
	//if(_actNum==1 || _actNum==3 || _actNum==2){
		recntPnl_Ttl(_numOfDelHideRestoreVoc);
//	}
}

function myvocDelVoc(_srcNum , _ctr){//刪除我的字庫單字//一次刪除一字//src=>1 myvoc, 2 vjDic, 3 vjDic + ReviewStatusOK 
	var tgtId = "";	
	var vocId = "";
	if(_srcNum==1){
		tgtId = '#vocId';
		vocId = $( tgtId +_ctr).val();
	}else if(_srcNum==2){
		tgtId = '#vjDicId';
//var qStr=tgtId + _ctr;
		vocId = $( tgtId + _ctr ).val();
	}else if(_srcNum==3){
		tgtId = '#vjDicVocId';
		vocId = parseInt($( tgtId + (_ctr-2)).text());
		ttlreviewVid = parseInt($('#ttlreviewId' + (_ctr-2)).text());
	}
	var fnIfSuccess = function (data){		
//alert(data);		
		retainSamePg(1);		
	}
//alert(_srcNum+" & "+ _ctr +" & "+ vocId+ " & q=> "+qStr);	
//alert('tgtVocId=>'+vocId);
	if(_srcNum==1){
		callPhpFn('delRowBatch', [vocId,'',''], fnIfSuccess);	
	}else if(_srcNum==2){
		callPhpFn('delRowBatchVjVoc', [vocId,'',''], fnIfSuccess);
	}else if(_srcNum==3){
		callPhpFn('delRowBatchVjVoc', [vocId, ttlreviewVid,	1], fnIfSuccess);
	}		
}
function myvocBatchAct(_actNum){	
	$('#actChoice').addClass('hidden');
	$('#vjDicActChoice').addClass('hidden');
	var tgtRowCtr  ='';
	var tgtChkBox  ='';
	var tgtVoc     ='';
	var vocIdAryStr='';
	//var i=0;
//alert("voc=>"+$("#vocId"+(i+1)).val());	
	if(_actNum==1 || _actNum==2 || _actNum==6){//個人字庫
		tgtRowCtr ='#rowCtr';
		tgtChkBox ='choiceChkbox';
		tgtVoc    ='#vocId';
	}else if(_actNum==3 || _actNum==4 || _actNum==5){//總庫
		tgtRowCtr ='#vjDicRowCtr';
		tgtChkBox ='vjDicChkBox';
		tgtVoc    ='#vjDicId';//vjDicVocId
	}	
	var rowNum = $(tgtRowCtr).val();
	
	var selCtr = 0;
	for( var i=0; i<rowNum; i++ ){		
		if($('input[name='+ tgtChkBox + i +']:checked').val()=='on'){
			selCtr++;
			if(_actNum==1 || _actNum==2 || _actNum==6){
				vocIdAryStr+= $( tgtVoc+ i).val()+',';				
			}else if(_actNum==3 || _actNum==4 || _actNum==5){
				vocIdAryStr+= $( tgtVoc + i ).val()+',';
			}			
		}
	}
	vocIdAryStr = vocIdAryStr.substring(0,vocIdAryStr.length-1);	
//alert(rowNum+" & "+tgtChkBox+"_&_"+tgtVoc+"\n"+vocIdAryStr);
	var fnIfSuccess = function (data) {		
//alert(data);
		retainSamePg(selCtr);		
	}
	if(_actNum==1){	//del myvoc
//alert(vocIdAryStr);	
		callPhpFn('delRowBatch', [vocIdAryStr, '', ''], fnIfSuccess);		
	}else if(_actNum==2){//hide myvoc
		callPhpFn('updateColBatch', ["hide", 1, vocIdAryStr], fnIfSuccess);	
	}else if(_actNum==3){//del vjdic
		callPhpFn('delRowBatchVjVoc', [vocIdAryStr, '', ''], fnIfSuccess);
	}else if(_actNum==4){//hide vjdic
		callPhpFn('updateColBatchVjDic', ["hide", 1, vocIdAryStr], fnIfSuccess);		
	}else if(_actNum==5){//restore hide vjdic
		callPhpFn('updateColBatchVjDic', ["hide", 0, vocIdAryStr], fnIfSuccess);		
	}else if(_actNum==6){//restore hide myvoc
		callPhpFn('updateColBatch', ["hide", 0, vocIdAryStr], fnIfSuccess);		
	}	
}
function myvocChkAll(_tgtNum){		//0總庫_1個人
	//alert(_tgtNum);
	//.switchClass( removeClassName, addClassName [, options ] );
	var tgtRowCtr  ='';
	var tgtChkBox  ='';	
	var rowNum 	   = '';

	if(_tgtNum==0){
		tgtChkBox ='vjDicChkBox';
		tgtRowCtr ='#vjDicRowCtr';
		rowNum = $(tgtRowCtr).val();
		if($('input[id="vjDicChkAll"]:checked').val()=='on'){
			$('#vjDicActChoice').removeClass('hidden');
			var k;
			for(var i=0;i<rowNum;i++){				
				k = document.getElementById( tgtChkBox + i);
				$('#vjDicTr' + i).removeClass('ttlTrOdd');
				$('#vjDicTr' + i).removeClass('ttlTrEven');
				$('#vjDicTr' + i).addClass('chosen');
				if(k==null){
					break;
				}else{
					k.checked=true;
				}
			}
		}else{
			$('#vjDicActChoice').addClass('hidden');
			for(var i=0;i<rowNum;i++){				
				$('#vjDicTr' + i).removeClass('chosen');
				if(i%2!=0){
					$('#vjDicTr' + i).addClass('ttlTrOdd');
				}else{
					$('#vjDicTr' + i).addClass('ttlTrEven');
				}
				var k=document.getElementById( tgtChkBox + i);
				if(k==null){
					break;
				}else{
					k.checked=false;
				}	
			}
		}	
	}else if(_tgtNum==1){
		tgtChkBox ='choiceChkbox';
		tgtRowCtr ='#rowCtr';
		rowNum = $(tgtRowCtr).val();
		if($('input[id="myvocChkAll"]:checked').val()=='on'){
			$('#actChoice').removeClass('hidden');
			var k;
			for(var i=0;i<rowNum;i++){				
				$('#myvoc_Tr' + i).removeClass('myvocTrOdd');
				$('#myvoc_Tr' + i).removeClass('myvocTrEven');
				$('#myvoc_Tr' + i).addClass('chosen');
				//$('#myvoc_Tr' + i).css('background','orange');
				k = document.getElementById('choiceChkbox'+i);
				if(k==null){
					break;
				}else{
					k.checked=true;
				}	
			}
		}else{
			$('#actChoice').addClass('hidden');
			for(var i=0;i<rowNum;i++){
				$('#myvoc_Tr' + i).removeClass('chosen');
				if(i%2!=0){
					$('#myvoc_Tr' + i).addClass('myvocTrOdd');
				}else{
					$('#myvoc_Tr' + i).addClass('myvocTrEven');
				}
				var k=document.getElementById('choiceChkbox'+i);
				if(k==null){
					break;
				}else{
					k.checked=false;
				}	
			}
		}	
	}	
}
function midNum(pageTxt, startPos, minusLen) {
	var pageTxtLen = pageTxt.length;
	var page = parseInt(pageTxt.substr(startPos, pageTxtLen - minusLen));
	return page;
}
function miniKK(){
	if(localStorage.getItem("kkFocused")=="true"){	
		$('#vocKK').focus();
		var selStart=parseInt(localStorage.getItem("kkLPos"));
		document.getElementById('vocKK').setSelectionRange(selStart, selStart);
	}else{
		$('#vocKK').focus();
	}
	$('#miniKK').removeClass('hidden');
	var fnPar="";	
	pasteHtmlToDiv('miniKK', 'miniKK', fnPar);
}
function markSel(){		
	var lastEx=$('#vocEx').val();
	if(lastEx!=""){	localStorage.setItem('lastEx', lastEx);}		
	var txtarea = document.getElementById("vocEx");	
	var selStartPos=txtarea.selectionStart;
	var selEndPos=txtarea.selectionEnd;
	var sel=txtarea.value.substring(selStartPos,selEndPos);/*取得選取字串*/
	var txtAreaValue=$('#vocEx').val();
	if(sel.length>0 && txtAreaValue!=""){
		document.getElementById("vocEN").value=trim(sel);/*選取單字並將英文欄變成該選取字*/
		
		//updateList();
		
		var LspNum=sel.match(/^\s*/)[0].length;
		var RspNum=sel.match(/\s*$/)[0].length;
//alert('sel=>' + sel + '<' + '& spaceL= '+ LspNum + ' & spaceR= ' + RspNum);
		$('#vocEx').val(replaceSymb($('#vocEx').val(),"【","╪"));
		$('#vocEx').val(replaceSymb($('#vocEx').val(),"】","╪"));
		txtAreaValue=$('#vocEx').val();
		selStartPos += LspNum;
		selEndPos -= RspNum;
		txtAreaValue=txtAreaValue.substring(0, selStartPos) + "【" + txtAreaValue.substr(selStartPos);/*加生字框*/
		txtAreaValue=txtAreaValue.substring(0, selEndPos+1) + "】" + txtAreaValue.substr(selEndPos+1);	
		txtAreaValue=replaceSymb(txtAreaValue,"╪","");
		$('#vocEx').val(txtAreaValue);				
		srchDef();/*加生字框後再搜尋該單字*/
	}	
}
function mbShowForm(){	
	//alert('gogo');
	$("#mbFbPageBtn").toggle();
	$("#mbTSswBtn").toggle();
	$("#mbLoginForm").removeClass('hidden');		
}
function mbShowBuilder(){
	//alert('builder');
	$("#vjMUCbtn0").toggle();
	$("#vjMUCbtn2").toggle();
	$("#vjMUCbtn3").toggle();
	$("#vjMUCbtn4").toggle();	
	$("#vjMbuilder").removeClass('hidden');
	$("#vocEX").text("請輸入例句");
	$("#vocEX").css("color","gray");
}
function mbChkVocExHolder(){
	if($("#vocEX").text().trim()=="請輸入例句"){
		$("#vocEX").text("");
		$("#vocEX").css("color","black");
	}	
	$( "#vocEX" ).blur(function() {
		if($("#vocEX").text()==""){
			$("#vocEX").text("請輸入例句");
			$("#vocEX").css("color","gray");
		}
	});	
}
function mbMarkSel(){
	//var lastEx=$('#vocEX').val();
	//if(lastEx!=""){ localStorage.setItem('lastEx', lastEx);}		
	// var txtarea     = document.getElementById("vocEX");	
	// var selStartPos = txtarea.selectionStart;
	// var selEndPos   = txtarea.selectionEnd;
	// var sel         = txtarea.value.substring(selStartPos,selEndPos);/*取得選取字串*/
	// var txtAreaValue= $('#vocEX').val();
	// if(sel.length>0 && txtAreaValue!=""){
		// document.getElementById("vocEN").value=trim(sel);/*選取單字並將英文欄變成該選取字*/		
		//updateList();		
		// var LspNum=sel.match(/^\s*/)[0].length;
		// var RspNum=sel.match(/\s*$/)[0].length;
		//alert('sel=>' + sel + '<' + '& spaceL= '+ LspNum + ' & spaceR= ' + RspNum);
		// $('#vocEX').val(replaceSymb($('#vocEX').val(),"【","╪"));
		// $('#vocEX').val(replaceSymb($('#vocEX').val(),"】","╪"));
		// txtAreaValue=$('#vocEX').val();
		// selStartPos += LspNum;
		// selEndPos -= RspNum;
		// txtAreaValue=txtAreaValue.substring(0, selStartPos) + "【" + txtAreaValue.substr(selStartPos);/*加生字框*/
		// txtAreaValue=txtAreaValue.substring(0, selEndPos+1) + "】" + txtAreaValue.substr(selEndPos+1);	
		// txtAreaValue=replaceSymb(txtAreaValue,"╪","");
		// $('#vocEX').val(txtAreaValue);		
		//srchDef();/*加生字框後再搜尋該單字*/
	// }
}

function memUpgCnfm(_UpgCode){
	//alert(_UpgCode);
	//var tgtUserId	=	$("#vjUid").val();
//alert('id=>'+tgtUserId);
	var fnIfSuccess = function (data){		
//alert(data);		
		$("#pplItemSN").val( data.trim() );
		document.getElementById("ppyItemForm").submit();
	}
	
	callPhpFn('getItemSN', _UpgCode, fnIfSuccess);
}





function memMngtOrder(_tgt){		//會員排序
//alert('tgt=>'+_tgt);
	var _tgtOrg	=	parseInt(_tgt);
	var vjLmt	=	parseInt($('input[name=lmtRadio]:checked').val());	
	var vjOfst	=	0;
	var vjTtlMem=	parseInt($('#memTtlNum').text());
	var vjSrt;
	
	if(getCookie('vjSrt') && _tgtOrg<99){	
		if(getCookie('vjSrt')=='0'){
			doCookieSetup('vjSrt',	'1');			
		}else{
			doCookieSetup('vjSrt',	'0');	
		}
	}else{
		vjSrt	=	parseInt($('input[name=sortRadio]:checked').val());
		doCookieSetup('vjSrt',	vjSrt);
	}
	doCookieSetup('vjLmt',	vjLmt);
//alert('tgtin_'+_tgt+'_tgtParse_'+_tgtOrg);	
	if(_tgtOrg<99){//非換頁
		$('#vjmm0').text(_tgtOrg);
		if(_tgtOrg==8){
			var memType	=	$("#memTypeSel").val();
			$('#vjmm3').text(memType);
		}
	}else{//以下為換頁用
		var lastOfst;
		var vjTtlRlt=	parseInt($('#memTtlRltNum').text());
		
		if($('#vjmm3').text()==''){
			lastOfst	=	Math.floor(vjTtlMem/vjLmt)*vjLmt;
		}else{
			lastOfst	=	Math.floor(vjTtlRlt/vjLmt)*vjLmt;
		}
		
		
		if(getCookie('vjOfst')){
			vjOfst	=	parseInt(getCookie('vjOfst'));
		}
		
		if(_tgtOrg==100){//回首頁
			vjOfst=0;
		}else if(_tgtOrg==101){//上一頁
			vjOfst	=	vjOfst	-	vjLmt;
			if(vjOfst<0){
				vjOfst=0;
				//alert('這是第一頁');
			}
		}else if(_tgtOrg==102){//下一頁
			vjOfst	=	vjOfst	+	vjLmt;			
			if(vjOfst>lastOfst){
				vjOfst	=	lastOfst;
				//alert('這是最後一頁');
			}
		}else if(_tgtOrg==103){//最後一頁
			vjOfst	=	lastOfst;
		}
		$('#vjmm2').text(vjOfst);
		doCookieSetup('vjOfst',	vjOfst);
	}
	$('#rootForadmLink0').addClass('epty');	
	go2Front_part2('admLink0');
	
}
function onlineCtr(){				//計算線上人數及線上ID--管理員用--要按 "線上人數" 才會啟動	
	var limit = 86400000;//這是一天
	var waitTime2 = 3000;//3秒//js waitTime ，PHP chkOnlineStat 10秒就10秒 //這個不會造成太大影響，因為要按 "線上人數" 才會啟動
	var filter="";
	var fnIfSuccess = function (data) {
//alert(data);
		$("#onlineCtr").text(data);
		filter = $("#statusToggler").text();
		pasteHtmlToDiv('tracking', 'rootForadmLink2', filter);
	}		
	var timer = setInterval(function () {
			if (limit > 0) {
				if(doOnlineCtr){
					callPhpFn("onlineCtr", "", fnIfSuccess);									
				}
				limit = limit - waitTime2;	
			} else {
				clearInterval(timer);
			}
		}, waitTime2);
}
function oneUserBhv(_userId){		//紀錄用戶動作
//alert('seeBhv=>'+_userId);
	//_userId=4;
	pasteHtmlToDiv('tracking', 'rootForadmLink2', "user_" +_userId);
}
function openWinRead() {			//開新視窗-閱讀模式
    readingWindow = window.open("http://www.vocabjet.com/mockSite/", "", "width=1300, height=600");  // Opens a new window
	readingWindow.moveTo(0, 0);
	windowResize();
}

function prepMsg(boxName, _par0, _par1, itemName){
	//boxName,purchased,installed,itemName
	var fnIfSuccess = function (data) {
		if(data.trim()=='沒cookie'){
			//showCookieExpiredModalAndLogout();
		}else{
			prepMsg_part2(boxName, _par0, _par1, itemName);
		 }
	 }
	callPhpFn('chkCookie', '', fnIfSuccess);
}
function prepMsg_part2(boxName, _par0, _par1, _pkgCode){	 
	//boxName,purchased,installed,itemName
	var itemName;
	itemName = pkgCodeToName(_pkgCode);
	$('#mkBoxA_buff_1').val(_pkgCode);//拿書名
//alert(_pkgCode);
	switch(boxName){
		case "mkBoxA":
			if(_par0=="un_purchased"){//下載
				$('#'+boxName+'_txt').text("『" + itemName +"』字庫目前免費，是否下載？");
				$('#mkBoxA_buff_0').val('purchase');
				$('#mkBoxAconfirmBtn').text('現在下載');//現在購買
			}else if(_par1==1){//解除安裝
				$('#'+boxName+'_txt').text("『" + itemName +"』字庫已安裝，是否解除安裝？");
				$('#mkBoxA_buff_0').val('uninstall');
				$('#mkBoxAconfirmBtn').text('解除安裝');
			}else if(_par1==0){//安裝
				var fnIfSuccess = function(data){
//alert(data);		
					$('#mkBoxA_CxlBtn').removeClass('hidden');
					if(data.trim() == "Failed"){						
						$('#'+boxName+'_txt').text("『" + itemName +"』字庫上次安裝時間小於30分鐘，請稍後再安裝。");
						$('#mkBoxA_buff_0').val('suspend');
						$('#mkBoxA_CxlBtn').addClass('hidden');
						$('#mkBoxAconfirmBtn').text('確認');
					}else{
						$('#'+boxName+'_txt').text("『" + itemName +"』字庫已完成下載，現在安裝？");//已完成購買
						$('#mkBoxA_buff_0').val('install');
						$('#mkBoxAconfirmBtn').text('現在安裝');
					}
				}	
				callPhpFn('chkPkgInstallTM', _pkgCode, fnIfSuccess);			
			}else if(_par0 == "purchased" && _par1 == 2){//刪除
				$('#'+boxName+'_txt').text("確定刪除『" + itemName + "』字庫？");
				$('#mkBoxA_buff_0').val('remove');
				$('#mkBoxAconfirmBtn').text('確認刪除');
			}		
		break;		
	}		
}
function pakCaller(_caller){		//_caller=0: 已購買字庫; _caller=1: 全站字庫
	localStorage.setItem("pakCaller",_caller);	
}
function parControl(){				//控制Builder單字後的括號
	if($('#bktNum').text() != "" && engStr != $('#vocEN').val()){
		$('#bktNum').text('');
	}
	if($('#bktNum').text() == "" && engStr == $('#vocEN').val()){
		if(bracketNum!=0){$('#bktNum').text( '(' + bracketNum + ')');}		
	}	
}
function pasteKK($KK){				//小鍵盤「上字」	
	var o = document.getElementById('vocKK');
	var kk = $('#vocKK').val();
	var kkLen=kk.length;
	var selStart=getSelectionStart(o);
	var kkL= kk.slice(0, selStart);
	var kkR= kk.slice(selStart,kkLen);
	kkL+=$KK;			
	localStorage.setItem("kkLPos", selStart+1);
	$('#vocKK').val(kkL+kkR);	
	$('#vocKK').focus();		
	document.getElementById('vocKK').setSelectionRange(selStart+1, selStart+1);	
}
function pasteDef(pos,kk,def){		//定義全上		
	$("#vocCH").val(def);
	$("#vocKK").val(escapeStrBk2(kk));
	if(pos !=""){//pos="(詞性)";		
		pos = pos.replace("【","");
		pos = pos.replace("】","");
		pos = "【"+ pos +"】";	
		$("#vocPOStxt").val(pos);
	}
}
function pastePos(_pos){			//上總庫詞性
	if(_pos !=""){		
		_pos = _pos.replace("【","");
		_pos = _pos.replace("】","");
		_pos = "【"+ _pos +"】";	
		$("#vocPOStxt").val(_pos);
	}
}
function pasteKKttl(_kk, _ct){		//上總庫音標
	$("#vocKK").val(escapeStrBk2(_kk));
}
function pasteCh(_ch, _ct){			//上總庫中文
	$("#vocCH").val(_ch);
}
function pstHL(_tgtId, _activeOrInactive, _style){//標亮要貼上的定義
	if(_activeOrInactive == 0){//移除標亮區
		$('#'+_tgtId).removeClass('pstHLT'+_style);		
	}else if(_activeOrInactive == 1){//標亮選擇區
		$('#'+_tgtId).addClass('pstHLT'+_style);
	}
}
function pasteOrgBack(){
	//var bldrAry=["vocEN","vocCH","vocKK","vocPOStxt","vocRmk","vocEx","vocOri"];
	
	for(var i=0; i<bldrAryLen;i++){
		document.getElementById(bldrAry[i]).value=vTmp[i];
		document.getElementById(bldrAry[i]).style.color = "black";
	}
}
function pasteLstEx(){
	var str=localStorage.getItem('lastEx');
	str = str.replace(/[【】]/g,"");
	//str = str.replace(/】/g,"");
	$('#vocEx').val(str);
}
function pasteHtmlToDiv(fnName, tgtId, fnPar) {
	var fnIfSuccess = function (data) {
		document.getElementById(tgtId).innerHTML = data;		
		if (fnName == "myvoc" || fnName == "updateVocTable") {
			setWinHeight("whiteBack");
		}		
	}
	callPhpFn(fnName, fnPar, fnIfSuccess);
}
function pasteVocTbl_toBeDeleted(_tableVars, _vocPageData, _caller) { //成功後刪除
	fnIfSuccess = function (data) {
		//alert("data: " +data);
		if (_vocPageData != "") {
			document.getElementById('rootForlink2').innerHTML = _vocPageData;
		}
		document.getElementById('myvocTbl').innerHTML = data;

		if (_vocPageData != "") {
			panelType = localStorage.getItem("panelType");
			setPanelType(panelType);
			switch (panelType) {
				case 'link2'   :	tgtBuff = 'srchAllCons';	break;
				case 'vocLink0':	tgtBuff = 'srchAllCons';	break; //全部單字
				case 'vocLink1':	tgtBuff = 'srchUsrBdCons';	break; //自建單字
				case 'vocLink2':	tgtBuff = 'srchVjPkgCons';	break; //本站單字
				case 'vocLink3':	tgtBuff = 'srchCstmCons';	break; //自訂查詢
				case 'vocLink4':	tgtBuff = 'srchTtlVocs';	break; //全站單字
			}
			var buffStr = localStorage.getItem(tgtBuff);
			var buffAry = buffStr.split(",");

			//******取得查詢結果總筆數**start*****
			if ($("#qryNums").text() != '') {
				var rltTxt = $("#qryNums").text() + "字";
			} else {
				var rltTxt = "0字";
			}//******取得查詢結果總筆數**end*****			

			if (_caller == 'vocLink3' && buffAry[5] == '') {
				shwPnl('true');
				
			} else if (_caller == 'vocLink4' && buffAry[5] == '') {
				shwPnl('true');
				$("#ltrSelector").val(buffAry[11]).attr('selected',true);
			} else if(_caller == 'vocLink4' && buffAry[5] != ''){
				shwPnl('false');
				$("#ltrSelector").val(buffAry[11]).attr('selected',true);
				$('#getTtlVocNums').text(rltTxt);
				var buffAry = buffStr.split(",");
				var pageNum = (buffAry[2] / buffAry[1]) + 1;
				var pageTxt = "第" + pageNum + "頁";
//alert('Page=>'+pageTxt);
				$("#myvocOfst").val(pageTxt).attr('selected', true); //選單停在選定頁數
				$("#myvoLmt").val(buffAry[1]).attr('selected', true); //選單停在選定頁數
				$("#myvocOdr").val(buffAry[0]).attr('selected', true); //選單停在選定頁數				
			}else {
				shwPnl('false');
				if (buffStr == "" || buffStr == null) {
				//if (buffStr) {
					//alert("buffer Empty: "+buffStr);
				} else {
					$('#getTtlVocNums').text(rltTxt);
					//ttlPageDefault();//qq

					var buffAry = buffStr.split(",");
					var pageNum = (buffAry[2] / buffAry[1]) + 1;
					var pageTxt = "第" + pageNum + "頁";
//alert('Page=>'+pageTxt);
					$("#myvocOfst").val(pageTxt).attr('selected', true); //選單停在選定頁數
					$("#myvoLmt").val(buffAry[1]).attr('selected', true); //選單停在選定頁數
					$("#myvocOdr").val(buffAry[0]).attr('selected', true); //選單停在選定頁數
				}
			}
		}
		if ($('#myvocTbl').height() < 50) {
			var div1H = $('#topbar').height(); //topbar height
			var div2H = $('#rootForlink2').height(); //roofstage height
			var newH = $(document).height() - div1H - div2H + 102; //footer位置
			$('#rootForlink2').height(newH); //rootForlink2的底，即footer的頂端
		}
	}
	callPhpFn('updateVocTable', _tableVars, fnIfSuccess);
}
function playVocMP3(_eng){			//撥放MP3檔
//alert('playVocMP3=>'+_eng);
	var eng = removeNum(_eng).trim();
	//eng = escapeStrBk(eng);
	eng = eng.replace(/╪/g	,"'");
	var vocFolder = (eng.slice(0,1)).toLowerCase();
	var srcStr="../audio/" + vocFolder + "/"+ eng +".mp3";
	$("#vjPlayer").attr("src", srcStr);
	var foo = document.getElementById('vjPlayer');
	foo.play();
}
function playVocMP3_B(_audioDir){	//
	//var eng = removeNum(_eng).trim();	
	//eng = escapeStrBk(eng);
	//eng = eng.replace(/╪/g	,"'");
	//var vocFolder = (eng.slice(0,1)).toLowerCase();
	//var srcStr="../audio/" + vocFolder + "/"+ eng +".mp3";
//alert(_audioDir);
	$("#vjPlayer").attr("src", _audioDir);
	var foo = document.getElementById('vjPlayer');
	foo.play();
}
function pkgCal(){					//重算字庫字數
	var fnIfSuccess = function (data) {
		alert(data);	
	}
	callPhpFn('pkgCal', '', fnIfSuccess);
}
function pkgCodeToName(_pkgCode){	//安裝包代碼翻譯
	var pkgName	=	_pkgCode;
	for(var i=0; i < pkgNameAry.length; i++){
		if(	pkgName ==	pkgNameAry[i][1]){
			pkgName	= 	pkgNameAry[i][2];
			break;
		}
	}		
	return pkgName;
}
function reg() {
	var rInfoAry=	[];
	var goReg 	=	true;	
	var msgTxt	=	"";
	var chkEmail=	false;
	var chkPw	=	false;
	var focusTgt=	"";
	for (var i = 0; i < 3; i++) {
		rInfoAry[i] = $('#rInfo' + i).val();
		if(rInfoAry[i]==''){
			if(i==0 || i==1){
				msgTxt='帳號及密碼欄位不可空白';
				goReg=false;
			}
		}		
	}
	rInfoAry[3] = $('input[name=vlang]:checked').val();	
	rInfoAry[4] = "notFb";
	if(localStorage.getItem("country")!=null){
		rInfoAry[5] = localStorage.getItem("country");
	}else{
		rInfoAry[5] = 'tw';
	}
	if(localStorage.getItem("hrDiff") != null){
		rInfoAry[6] = localStorage.getItem("hrDiff");
	}else{
		rInfoAry[6] = '-4';
	}
	
	chkEmail = validateEmail(rInfoAry[0]);
	if(goReg && chkEmail==false){
		msgTxt='email格式錯誤，請輸入正確email';
		$('#rInfo0').val('');
		goReg=false;
		focusTgt='rInfo0';	
	}
	chkPw = validatePw(rInfoAry[1]);	
	if(goReg && chkPw==false){
		msgTxt='密碼需大於6個字元';
		$('#rInfo1').val('');
		goReg=false;
		focusTgt='rInfo1';	
	}	
//alert('acct= '+rInfoAry[0]+'\npw= '+rInfoAry[1]+'\nnickname= '+rInfoAry[2]+'\nlang= '+rInfoAry[3]+' & '+rInfoAry[4]+ ' & '+rInfoAry[5]+' & '+rInfoAry[6]);
	var fnIfSuccess = function (data) {
//alert('Reg=>'+data);
		$cookieChk = checkCookie();
		if ($cookieChk == true) { //檢查瀏覽器是否可用cookie
			if (data.trim() != 'fail') {
				alert('註冊成功！請到您的電子郵件收取帳號開通信件。');
				window.location.reload();
//window.location.href = "userCenter.php";
			} else {
				alert('註冊失敗！請選擇其他帳號。');
			}
		} else {
			alert('請啟用瀏覽器cookie功能！');
		}
	}
	if(goReg){
		callPhpFn('reg', rInfoAry, fnIfSuccess);		
	}else{
		//alert("Reg Fail");		
		$('#regMsgTxt').text(msgTxt);
		$('#tgtHolder').val(focusTgt);
		$('#regMsg').modal('show');		
	}
}
function resumeIdleTimer(){			//待機時間歸零
	_idleSecondsCounter = 0;
	if(idleTimerStopped){	
		idleTimer	=	setInterval(checkIdleTime, 1000);	
		idleTimerStopped	=	false;		
	}
}
function replaceSymb(inStr, oldSym, newSym){//自訂函數，更換字串內指定字符並回傳//╪
	var newStr="";
	var strLen=inStr.length;
	for(var i=0;i<strLen;i++){
		if(inStr.substring(i,i+1) == oldSym){
			ltr=newSym;
		}else{
			ltr=inStr.substring(i,i+1);
		}
			newStr += ltr;
	}
	return newStr;
}
function removePar(_voc){
	var pos=_voc.indexOf("(");
	if(pos>-1){
		var strLen=_voc.length;
		_voc=_voc.slice(0,pos);
	}	
	return _voc;
}
function rootDisplay(linkId){
	var rootDivAry = ['rootForlink0', 'rootForlink1','rootForlink2', 'rootForlink3', 'rootForlink4',
		'rootForlink5', 'rootForlink6', 'rootForlink7', 'rootForadmLink0', 'rootForadmLink1', 'rootForadmLink2', 'rootForpakLink0' , 'rootForpakLink1'];
	for (var i = 0; i < rootDivAry.length; i++) {
		$('#' + rootDivAry[i]).addClass('hidden');
	}
	$('#rootFor' + linkId).removeClass('hidden');
	//$('#'+linkId).addClass('usrLinkHover');
}
function resizeVJFooter(linkId){
	if(linkId=='pakLink0' || linkId=='link6'){
		$("#footer").css("height", "80px");
	}else{
		var winInnerH = window.innerHeight;
		var footerH = winInnerH-661;
		var pxFooterH=footerH + "px";		
		$("#footer").css("height", pxFooterH);		
	}	
	if(linkId=='link2' || linkId=='link3' || linkId=='vocLink0' || linkId=='vocLink1'){//
		$("#footer").css("margin-top", "10px");
	}else{
		$("#footer").css("margin-top", "0px");
	}	
}
function renewPanel(fnVar, _caller){//更新查詢條件面板			
	_caller= localStorage.getItem("panelType");//??			
	if(_caller=="vocLink0" || _caller=="vocLink1" || _caller=="vocLink2" ){
		$('#reSetQcon').addClass('hidden');
		$('#reStoreQcon').addClass('hidden');
	}	
	//******取得查詢結果總筆數**start*****
	if ($("#qryNums").text() != '') {
		var rltTxt = $("#qryNums").text() + "字";
	} else {
		var rltTxt = "0字";
	}//******取得查詢結果總筆數**end*****			

	var buffAry = fnVar;			
	if( _caller=='vocLink3' && buffAry[5]==''){//自訂查詢->顯示查詢條件頁
		shwPnl('true');
	}else if( _caller=='vocLink4' && buffAry[5]==''){//總字庫查詢->顯示查詢條件頁
		shwPnl('true');
	}else if( _caller=='vocLink4' && buffAry[5]!=''){
		shwPnl('false');
		$("#ltrSelector").val(buffAry[11]).attr('selected',true);
		$('#getTtlVocNums').text(rltTxt);
		var pageNum = (buffAry[2] / buffAry[1]) + 1;
		var pageTxt = "第" + pageNum + "頁";
//alert('renewPanel=>Caller=vocLink04 & 無查詢值=>Page+>'+pageTxt);
		$("#myvocOfst").val(pageTxt).attr('selected', true);
		$("#myvoLmt").val(buffAry[1]).attr('selected', true);
		$("#myvocOdr").val(buffAry[0]).attr('selected', true);
	}else{
		shwPnl('false');
		if (buffAry[0] != "") {
			$('#getTtlVocNums').text(rltTxt);
			var pageNum = (buffAry[2] / buffAry[1]) + 1;
			var pageTxt = "第" + pageNum + "頁";
//alert('renewPanel=>Page+>'+pageTxt);
			$("#myvocOfst").val(pageTxt).attr('selected', true); //選單停在選定頁數
			$("#myvoLmt").val(buffAry[1]).attr('selected', true); //選單停在選定頁數
			$("#myvocOdr").val(buffAry[0]).attr('selected', true); //選單停在選定頁數
		}
	}
}
function removeNum(_eng){			//移除單字後的括號，只回傳英文字	
	var engStr=_eng;
	if(isNumbered(_eng)){
		var leftBktPos  = _eng.indexOf("(");
		engStr = _eng.slice(0,leftBktPos);
	}
	return engStr;
}
function recntPnl_Ttl(_numOfDelVoc){//fake//計算總字數跟下拉頁數
	var ttlvocNumNow = parseInt($('#getTtlVocNums').text());
	var panelType = localStorage.getItem("panelType");
	if(panelType=='vocLink4'){
		var rowNum= $('#vjDicRowCtr').val();
	}else{
		var rowNum= $('#rowCtr').val();
	}
	var newTtlvocNum= ttlvocNumNow-_numOfDelVoc;
	$('#getTtlVocNums').text((newTtlvocNum)+'字');
	var ttlpageNum= Math.ceil(newTtlvocNum/rowNum);
	$('#myvocOfst option[value!=""]').remove(); //清空所有選項

	for (var i = 1; i < ttlpageNum + 1; i++) {
		addOption('myvocOfst', '第' + i + '頁'); //加入選項
	}	
	$('#ttlPages').text( ttlpageNum + '頁');
}
function removeBrkNum(_engStr){
	var engStr      =_engStr;
	if(isNumbered(_engStr)){
		var leftBktPos  = _engStr.indexOf("(");
		engStr      = _engStr.slice(0,leftBktPos);		
	}
	return engStr;
}
function recClickID(id) {
	switch(id){		
		case "link0":    id='u1'; break;//遊樂中心
		case "link1":    id='u2'; break;//新增單字//開啟builder
		case "link2":    id='u3'; break;//我的字庫
		case "link3":    id='u4'; break;//學習日誌
		case "link4":    id='u5'; break;//購物中心
		case "link6":    id='u6'; break;//新手教學
		case "link7":    id='ug'; break;//實用資源
		case "admLink0": id='u7'; break;//會員管理
		case "admLink1": id='u8'; break;//全站單字
		case "admLink2": id='u9'; break;//Tracking
		case "pakLink0": id='ua'; break;//已安裝字庫
		case 'vocLink0': id='ub'; break;//全部單字
		case 'vocLink1': id='uc'; break;//自建單字
		case 'vocLink2': id='ud'; break;//本站單字
		case 'vocLink3': id='ue'; break;//自訂查詢
		case 'vocLink4': id='uf'; break;//全站單字	
	}
	if (localStorage.getItem("behavior") === null) {
		localStorage.setItem("behavior", "");
	}			
	var recStr = localStorage.getItem("behavior");
	var newRecStr ;
	if (recStr != "" || recStr != 'null') {
		newRecStr= recStr + "," + id;
	} 
	localStorage.setItem("behavior", newRecStr);	
	$('#showBhvrStr').text(localStorage.getItem("behavior"));
}
function rsLink(_url){					//實用資源超連結開新頁面
	rsLinkWindow	=	window.open(_url,'_blank');
}
function setMyCookie(_varName, _varVal){//用Ajax存cookie
//alert(_varName+" & "+ _varVal);
	var fnIfSuccess = function (data) {
//alert(data);
	}
	callPhpFn('setMyCookie', [_varName, _varVal], fnIfSuccess);
}
function setOriVal(){
	var vocOriValue=$('#vocOriSel option:selected').val();
	$('#vocOri').val(vocOriValue);
	if($('#vocOri').val()=='' || vocOriValue =='(未定義)'){
		$('#choseLastOri').fadeIn(0);
	}else{
		$('#choseLastOri').fadeOut(0);		
	}	
	//alert("Select: "+vocOriValue);
}
function srchDefByDefaultDic(){		//使用預設字典查詢定義
	//預設查詢字典//start	
	var _voc		=	removePar($('#vocEN').val().trim());
	var defDicAddr	=	dicAry[(userDefDicNum-1)*3+4];//dicAry在userCenter定義
	var winType		=	dicAry[(userDefDicNum-1)*3+5];//userDefDicNum在userCenter定義			
	chgDic2(defDicAddr,	_voc,	winType,	0);		
	//預設查詢字典//end
}
function sameVocPlus(_num){			//會員已有該字，但決定繼續編輯新定義
	srchDefByDefaultDic();//使用預設字典查詢定義
	$('#bldrCover').addClass('hidden');
	engStr = document.getElementById('vocEN').value;	
	var addAnoVoc = $('#addAnoVoc').text();	
	bracketNum=_num;	
	$('#bktNum').html("(" + bracketNum +")");
	$('#bktNum').removeClass('hidden');	
	var fnIfSuccess = function (data) {
//alert('showTTLdic: '+data);
		document.getElementById('vjWindow').innerHTML =	escapeStrBk(data);
	}	
	callPhpFn('srchTTLdic', engStr, fnIfSuccess);
}
function pasteAllRepEn(_data, _voc){//顯示重複字modal
	$('#haveThisVoc').modal();
	document.getElementById('vocDefWindow').innerHTML = escapeStrBk(_data);
}
function srchMyvoc9999999(_voc){	//目前沒使用
	var fnIfSuccess = function (data) {
		if(data.trim()!="No match"){
			pasteAllRepEn(data, _voc);			
		}else{
			srchTTLdic();
		}		
	}
	callPhpFn('srchMyvoc', _voc, fnIfSuccess);
}

function adjVjWindow(){				//調整builder全站字庫視窗尺寸
	/*var userWinH 	= 	$(window).height();
	var ttlWinH		=	document.getElementById('vjWindow').offsetHeight;//$('#vjWindow').height();
	var vjH			=	userWinH - 315;//50 top//265 upper bldr
//alert( "vjH= " + vjH + ", ttlWinH= " + ttlWinH + ", d= " + ( ttlWinH - vjH ) );	
	var ttlMinusVj	=	ttlWinH - vjH;
	
	var vjFooterH	=	$("#footer").height();	
	$('#vjWindow').addClass('showYScroll');
	$('#vjWindow').height( vjH - vjFooterH - 23 );*/	
}

function srchMyvoc(_voc){			//檢查個人字庫有沒有這個單字
	var fnIfSuccess = function (data) {
//alert(data);
		if(data.trim() != "No match"){//個人字庫有重複字//顯示modal
			pasteAllRepEn(data, _voc);
		}else{
			srchDefByDefaultDic();
		}
	}
	callPhpFn('srchMyvoc', _voc, fnIfSuccess);
}
function srchTTLdic(){				//查詢總字庫
	var engStr	=	removePar($('#vocEN').val().trim());//document.getElementById('vocEN').value;		
	var fnIfSuccess = function (data) {
		document.getElementById('vjWindow').innerHTML = escapeStrBk (data);	
$('#vjWindow').addClass('showYScroll');		
		adjVjWindow();
	}
	$('#mydicTopTxt').text( engStr );	
	callPhpFn('srchTTLdic', engStr, fnIfSuccess);
}
function srchDef(){					//按放大鏡
	var _voc 		= 	removePar($('#vocEN').val().trim());
	orgEng= _voc;
	
	if(_voc != ""){
		if($('#vocId').val()==""){	
			srchMyvoc(_voc);
		}else{
			srchDefByDefaultDic();
		}
		srchTTLdic();
	}	
}
function srchVocFast(_ctr, _voc){	//按下速查鈕
	//alert('hello '+_voc + ' & '+_ctr);
	var enStr	=	escapeStrBk(_voc);
	$('#qSrchENstr').text(enStr);
	srchDicFast(0);
	//$('#qSrchArea').removeClass('hidden');
}
function srchDicFast(_dicNum){		//速查字典
	var enStr	=	$("#qSrchENstr").text().trim();
	var _src	=	'';
	chsnDicNum	=	_dicNum;
	//alert(enStr+" & "+_dicNum);
	switch(_dicNum){
		case 0: _src='http://tw.dictionary.search.yahoo.com/search?p='; break;
		case 1: _src='http://tw.ichacha.net/'; break;
		case 2: _src='http://www.dictionary.com/browse/'; break;
		case 3: _src='http://www.urbandictionary.com/define.php?term='; break;
		case 4: _src='https://www.google.com.tw/search?tbm=isch&q='; break;
		case 5: _src='https://translate.google.com/#en/zh-TW/'; break;
		case 6: _src='http://dict.youdao.com/search?le=eng&q='; break;
		case 7: _src='http://dict.baidu.com/s?wd='; break;
		case 8: _src='http://wap.iciba.com/cword/'; break;
		case 9: _src='https://tw.voicetube.com/definition/'; break;
		case 10: _src='https://www.bing.com/images/search?q='; break;
		case 11: _src='http://www.thesaurus.com/browse/'; break;
		default: _src='http://tw.dictionary.search.yahoo.com/search?p=';
	}
	if(enStr!=''){
		chgDic2(_src, enStr, 'newWindow', '1');
	}else{
		alert('請先點選要查單字旁的【速查】鈕');
	}		
}
function setPanelType(_caller) { 	//後執行
	//alert("setPanel, caller: "+_caller );
	var ttlText = "";
	switch (_caller) {
		case 'link2'   :	ttlText = '全部單字';	break;
		case 'vocLink0':	ttlText = '全部單字';	break;
		case 'vocLink1':	ttlText = '自建單字';	break;
		case 'vocLink2':	ttlText = '本站單字';	break;
		case 'vocLink3':	ttlText = '自訂查詢';	break;
		case 'vocLink4':	ttlText = '總字庫'; $('#ltrSelector').removeClass('hidden'); break;
	}
//alert("setPanel, caller: "+_caller + ' & ttlText=>' + ttlText);
	$("#pnlTitle").text('❀'+ttlText+'❀');
	if(ttlText == '總字庫'){
		$("#vocPnl").removeClass('gr02');
		$("#vocPnl").addClass('gr03');
	}else{
		$("#vocPnl").addClass('gr02');
		$("#vocPnl").removeClass('gr03');
	}
}
function setupBfr(){
	var fnIfSuccess = function (data) {
		if(data.trim()=='沒cookie'){
			//showCookieExpiredModalAndLogout();
		}else{
			setupBfr_part2();
		 }
	 }
	callPhpFn('chkCookie', '', fnIfSuccess);
}
function setupBfr_part2(){
	setupBfrAry=[$('#userSetupNick').val(), $('#userSetupEmail').val(), $('#userSetupLang').val()];
	//alert("bfr" + setupBfrAry[0]+ setupBfrAry[1]+setupBfrAry[2]);
	$('#pwErrMsg').text('');
}
function setupChanged(){
	var hasChanged=false;
	//$('#userSetupLang').val()
	var setupCurAry=[$('#userSetupNick').val(), $('#userSetupEmail').val(), $('input[name=userSetupLang]:checked').val(), $('#hourDiffSel option:selected').val()];
	for(var i=0; i<4; i++){
		if(setupBfrAry[i] != setupCurAry[i]){
			hasChanged=true;
			break;
		}
	}
	return hasChanged;
}
function shwMyvocCstmQ2() {
	if ($('.pnl2').hasClass('hidden')) {
		$('.pnl2').removeClass('hidden');
	} else {
		$('.pnl2').addClass('hidden');
	}
}
function shwPnl(_isConPnl) {
	//alert("result= "+isQ);
	//isQ == 'true';
	if (_isConPnl == 'true') {//設定查詢條件頁
		$("#ltrSelector").val('QQ').attr('selected',true);
		$(".pnl0").addClass("hidden");
		$(".pnl1, #ltrSelector, #ltrSelectorLbl").removeClass("hidden");
		$("#reSetQcon, #myvocOdr, #myvocOdrLbl").addClass("hidden");	
		$("#reStoreQcon").removeClass("hidden");	
	} else {			//顯示查詢結果頁
		$(".pnl1").addClass("hidden");
		$(".pnl2").addClass("hidden");
		$(".pnl0").removeClass("hidden");
		$("#ltrSelector, #ltrSelectorLbl").addClass("hidden");
		_caller= localStorage.getItem("panelType");			
		if(_caller=="vocLink3" || _caller=="vocLink4"){
			$("#reSetQcon").removeClass("hidden");
		}		
		$("#reStoreQcon").addClass("hidden");
	}
}
function setWinHeight(divId) { 			//設定vocList div高度
//alert('listID=>'+listId);
	var listId='vocList';
	var height = $('#'+listId).height();
//alert('height=' + height);
	if(height>0){
		$("#" + divId).css("height", (($('#'+listId).height()) + 10) + "px");
	}
}
function setWinHeight2(divId, listId) { //設定logList div高度
	var height = $('#'+listId).height();
//alert('height=' + height);
	if(height>0){
		$("#" + divId).css("height", (($('#'+listId).height()) + 10) + "px");
	}
}
function showHiddenRs(_rsType){			//顯示隱藏資源連結
	var _rsFlag	=	$('#rsMode'+_rsType).text().trim();	
	if(_rsFlag!='rs4'){
		$('.hMk'+_rsType).addClass('hidden');
		$('#rsMode'+_rsType).text('rs4');
		$('#rsShow'+_rsType).text('顯示全部');		
	}else{
		$('.hMk'+_rsType).removeClass('hidden');
		$('#rsMode'+_rsType).text('rsAll');
		$('#rsShow'+_rsType).text('減少顯示');
	}
}

function showAllTodayVoc(){
//alert('show');
	var fnIfSuccess = function (data) {
//alert(data);
	document.getElementById('todayVocTgt').innerHTML = data;

	}
	
	callPhpFn('fromRef_showAllTodayVoc', 'All', fnIfSuccess);
	//callPhpFn('showAllTodayVoc', '', fnIfSuccess);
}

function showEx(_ctr){					//顯示英文單字例句
//alert('c=>'+_ctr);
	var ex	=	$('#vocEx'	+_ctr).text();
	var en	=	$('#vocEN'	+_ctr).val();
	var ch	=	$('#vocCH'	+_ctr).val();
	var ori	=	($('#orgName'+_ctr).text()).trim();	
	ex	= 	escapeStrBk(ex);
	en	= 	escapeStrBk(en);
	ch	= 	escapeStrBk(ch);
	ori	= 	escapeStrBk(ori);
	ex	=	ex.replace(/\n/g	,"<br>");	
	$('#exTxt').html(ex);		//例句
	$('#vocExTitle').text(en);	//例句的標題英文字
	$('#vocExCH').text(ch);		//例句英文的中文定義
	if(ori!=''){$('#vocExOri').text('~'+ori);}//沒出處不秀毛毛蟲
}
function showDel(rowNum) {
	//alert("rowNum= "+rowNum);
	var ctr = 0;
	var i = 0;
	while (document.getElementById('c' + i) != null) {
		if ($('#c' + i).is(":checked")) {
			++ctr;
		}
		i++;
	}
	if (ctr > 0) {
		$('#btnDelUser').removeClass('hidden');
	} else {
		$('#btnDelUser').addClass('hidden');
	}
}
function srchKeydown(){
	if(event.which == 13) {
		cstmSrch();		
	}	
}
function setCndtOpt(tgt){
	var srchCol = $('#myvocColName0 option:selected').val();
	if( srchCol == 'colName4'){
//alert('date col');	
	var d = new Date();
	var n = d.getTimezoneOffset();
	var hrDiff   = (n/60)*-1;	
	var todayStr = calcTime(hrDiff);
//alert('todayStr=>'+todayStr);
		$('#srchDiv').html('<input id="myvocSrchStr0" type="date" class="pnl1 abs" style="top:120px; left:15px; width:190px;" value="' + todayStr +'">');//日期格式要這樣：2016-03-27
	}else{		
		$('#srchDiv').html('<input id="myvocSrchStr0" class="pnl1 abs" style="top:120px; left:15px; width:190px;" value="" placeholder="查詢值" type="text" maxlength="25" onkeydown="srchKeydown();">');
	}	
	
	for(var i=0;i<7;i++){
		$('#cndtn'+i+tgt).addClass('hidden');
	}
	if($('#myvocColName'+(tgt-1)+' option:selected').val()=="colName4"){//colName4是不等於
		$('#myvocCndtn'+(tgt-1)).val("cndtn3");
		//$('#cndtn3'+tgt+', #cndtn4'+tgt+', #cndtn5'+tgt+', #cndtn6'+tgt).removeClass('hidden');
		$('#cndtn5'+tgt+', #cndtn6'+tgt+' ,#cndtn7'+tgt).removeClass('hidden');
	}else{
		$('#myvocCndtn'+(tgt-1)).val("cndtn0");//cndtn0是包含
		$('#cndtn0'+tgt+', #cndtn1'+tgt+', #cndtn2'+tgt+', #cndtn3'+tgt+', #cndtn4'+tgt).removeClass('hidden');
	}	
}
function showChrt(){					//**秀圖表**//目前沒有使用	
	/*var tgtId   = "chartcontainer";
	var myData  = new Array([10, 20], [15, 10], [20, 30], [25, 10], [30, 5]);
	var myChart = new JSChart( tgtId, 'line');
	myChart.setDataArray(myData);
	myChart.draw();	*/
}
function showCookieExpiredModalAndLogout(){//顯示cookie失效modal,並在5秒後自動登出//目前沒使用
	/*$('#cookiesExpiredCnfm').modal();
	var fnIfSuccess = function (data) {		
		setTimeout(function() {
			$('#cookiesExpiredCnfm').modal('hide');		
			window.location.href = "http://www.vocabjet.com/mockSite/index.php";
		}, 5000);				
	}
	callPhpFn('logout', '', fnIfSuccess);*/	
}
function trim(str) {
	str=replaceSymb(str,"【","");
	str=replaceSymb(str,"】","");
	var start = -1,
	end = str.length;
	while (str.charCodeAt(--end) < 33);
	while (str.charCodeAt(++start) < 33);
	return str.slice(start, end + 1);
}
function todayHover(vocInfoStr,_inOrOut){
//alert('vocStr=>'+vocInfoStr);
	todayVocAry 	=	vocInfoStr.split("《§》");
	if(_inOrOut==1){
		for(var i=0; i<bldrAryLen; i++){
			vTmp[i] = parent.document.getElementById(bldrAry[i]).value;		
		}
		for(var i=0; i<bldrAryLen; i++){
//alert('todayvoc[]=>'+todayVocAry[i]);
			parent.document.getElementById(bldrAry[i]).value= escapeStrBk (todayVocAry[i]);
			parent.document.getElementById(bldrAry[i]).style.color = "red";			
		}
		parent.document.getElementById(bldrAry[2]).value= escapeStrBk (kkBracket(todayVocAry[2]));
	}else if(_inOrOut==0){
		for(var i=0; i<bldrAryLen; i++){
			parent.document.getElementById(bldrAry[i]).value=vTmp[i];
			parent.document.getElementById(bldrAry[i]).style.color = "black";
		}
	}else{
		todayVocAry[2]	=	kkBracket(todayVocAry[2]);
		
		for(var i=0; i<bldrAryLen; i++){
			vTmp[i] = escapeStrBk (todayVocAry[i]);	
			parent.document.getElementById(bldrAry[i]).style.color = "black";
		}
		
		if(isNumbered(vTmp[0])){
			var leftBktPos  = vTmp[0].indexOf("(");
			var rightBktPos = vTmp[0].indexOf(")");
			var engStr      = vTmp[0].slice(0,leftBktPos);
			var numStr      = vTmp[0].slice(leftBktPos+1,vTmp[0].length);
			vTmp[0]= engStr;
			bracketNum   = parseInt(numStr);
			parent.jQuery('#bktNum').html("(" + bracketNum +")");			
			parent.jQuery('#bktNum').removeClass('hidden');		
		}else{
			parent.jQuery('#bktNum').addClass('hidden');
		}
		parent.jQuery("#editCaller").val("todayVoc");
		
doCookieSetup('orgEng',removePar(vTmp[0]));
//alert('Cookie=>'+getCookie('orgEng'));
	}
}
function tmPaste(tmpType,pRow){		
	pRow=pRow+1;
	//var bldrAry=["vocEN","vocCH","vocKK","vocPOStxt","vocRmk","vocEx","vocOri"];	
	var sourceAry;
	var sourceAryLen;	
	if(tmpType=="myvoc"){
		//sourceAry=["voc2EN","voc2CH","voc2KK","voc2POStxt","voc2Rmk","voc2Ex","voc2Ori"]    ;//
		sourceAry=bldrAry;
		sourceAryLen=bldrAryLen;	
	}else if(tmpType=="todayVoc"){
		sourceAry=todayVocAry;
		sourceAryLen=todayVocAryLen;			
	}
	//vocInfoAry[2]=kkBracket(vocInfoAry[2]);
	for(var i=0; i<sourceAryLen;i++){
		vTmp[i] = document.getElementById(sourceAry[i]).value;		
	}
	vTmp[2] = kkBracket(document.getElementById(sourceAry[2]).value);
	for(var i=0; i<sourceAryLen;i++){
		document.getElementById(sourceAry[i]).value= escapeStrBk ($("#"+sourceAry[i]+pRow).text());
		document.getElementById(sourceAry[i]).style.color = "red";
	}
}	
function toggleTON(){					//按出處選單時，同上次按鈕的反應
//alert("callToggleTON");
	var getOriTxt = $('#vocOri').val();//document.getElementById('vocOri').value;
	if(getOriTxt!=""){//&&  getOriTxt!="(未定義)"
//alert("getOriTxt is empty. ");
		$('#choseLastOri').fadeOut(0);
	}else{
		$('#choseLastOri').fadeIn(0);
//alert("empty");
	}
}
function ttlRead($inputStr){
	//alert($inputStr);			
	//$("#ttlReader").attr("src","../audio/"+$inputStr+".mp3");
	//var foo = document.getElementById('ttlReader');
	//foo.play();		
}
function toggleStatus(){
	var fnPar="";
	if($('#statusToggler').text()=="onlineOnly"){		
		fnPar="allStatus";
		$('#statusToggler').text('allStatus');
	}else{		
		fnPar="onlineOnly";
		$('#statusToggler').text('onlineOnly');
	}
	pasteHtmlToDiv('tracking', 'rootForadmLink2', fnPar);
}
function toggleActChoice(_tgtNum, _ctr){//0總庫_1個人
	if(_tgtNum==0){
		if($('input[name=vjDicChkBox'+ _ctr +']:checked').val()=='on'){
			$('#vjDicTr' + _ctr).removeClass('ttlTrOdd');
			$('#vjDicTr' + _ctr).removeClass('ttlTrEven');
			$('#vjDicTr' + _ctr).addClass('chosen');
		}else{
			$('#vjDicTr' + _ctr).removeClass('chosen');
			if(_ctr%2!=0){
				$('#vjDicTr' + _ctr).addClass('ttlTrOdd');
			}else{
				$('#vjDicTr' + _ctr).addClass('ttlTrEven');
			}
		}
		var rowNum = $('#vjDicRowCtr').val();
		var chk    = false;
		for( var i=0; i<rowNum; i++){
			if($('input[name=vjDicChkBox'+ i +']:checked').val()=='on'){
				chk=true;
				break;
			}
		}
		if(chk){
			$('#vjDicActChoice').removeClass('hidden');
		}else{
			$('#vjDicActChoice').addClass('hidden');
		}
	}else{
		if($('input[name=choiceChkbox'+ _ctr +']:checked').val()=='on'){
			$('#myvoc_Tr' + _ctr).removeClass('myvocTrOdd');
			$('#myvoc_Tr' + _ctr).removeClass('myvocTrEven');
			$('#myvoc_Tr' + _ctr).addClass('chosen');
		}else{
			$('#myvoc_Tr' + _ctr).removeClass('chosen');
			if(_ctr%2!=0){
				$('#myvoc_Tr' + _ctr).addClass('myvocTrOdd');
			}else{
				$('#myvoc_Tr' + _ctr).addClass('myvocTrEven');
			}
		}
		var rowNum = $('#rowCtr').val();
		var chk    = false;
		for( var i=0; i<rowNum; i++){
			if($('input[name=choiceChkbox'+ i +']:checked').val()=='on'){
				chk=true;
				break;
			}
		}
		if(chk){
			$('#actChoice').removeClass('hidden');
		}else{
			$('#actChoice').addClass('hidden');
		}
	}
}
function tsChg(){
	var newStr="";
	var orgStr = $('#vocCH').val();
	var tradStr = TongWen.convert( orgStr, TongWen.flagTrad);
	if(tradStr!=orgStr){
		newStr = tradStr;
	}else{
		newStr = TongWen.convert( orgStr, TongWen.flagSimp);
	}
	$('#vocCH').val(newStr);	
}
function toggleOnlineCtr(){				//變更 計算線上人數 樣式：啟動-白色 未啟動-灰色
	if(doOnlineCtr){
		doOnlineCtr=false;
		$("#onlineLbl").css("color","gray");
		$("#onlineCtr").addClass("hidden");
	}else{
		doOnlineCtr=true;
		$("#onlineCtr").removeClass("hidden");
		$("#onlineLbl").css("color","white");		
	}	
}
function toggleVjDicBtn(_hideOrShow, _ct){
	//-webkit-appearance: none;
	//-moz-appearance: none;
	//-webkit-appearance: none;
	
	if(_hideOrShow=='show'){
		$('#vjDicBtnHide' + _ct + ', #vjDicBtnDel' + _ct + ', #vjQsrchBtn' + _ct).removeClass('hidden');		
	}else{
		$('#vjDicBtnHide' + _ct + ', #vjDicBtnDel' + _ct + ', #vjQsrchBtn' + _ct).addClass('hidden');		
	}
}
function toggleActBtn(_hideOrShow, _ct){//檢視字庫時，hover單字列後，顯示功能按鈕
	if(_hideOrShow=='show'){
		$("#editBtn"+_ct+", #hideBtn"+_ct+", #delBtn"+_ct+", #unHideBtn"+_ct + ", #qSrchBtn"+_ct).removeClass('hidden');
		var ex=$('#vocEx'+_ct).text();
		if(ex != ''){
			$("#exBtn"+_ct).removeClass('hidden');
			$("#exTxt").text(ex);
		}		
	}else{
		$("#editBtn"+_ct+", #hideBtn"+_ct+", #delBtn"+_ct+", #exBtn"+_ct+", #unHideBtn"+_ct + ", #qSrchBtn"+_ct).addClass('hidden');
	}	
}
function ttlPageDefault() {
	var lmt        = $('#myvoLmt option:selected').val();
	var ttlVocNums = parseInt($("#getTtlVocNums").text());
	var ttlPages   = Math.ceil(ttlVocNums / lmt);
	$("#ttlPages").text(ttlPages + "頁");	
	panelType = localStorage.getItem("panelType");
	switch (panelType) {
		case 'vocLink0': tgtBuff = 'srchAllCons'  ;	break; //全部單字
		case 'vocLink1': tgtBuff = 'srchUsrBdCons';	break; //自建單字
		case 'vocLink2': tgtBuff = 'srchVjPkgCons';	break; //本站單字
		case 'vocLink3': tgtBuff = 'srchCstmCons' ;	break; //自訂查詢
		case 'vocLink4': tgtBuff = 'srchTtlVocs'  ;	break; //全站單字
	}
	var buffStr = localStorage.getItem(tgtBuff);
	var buffAry = buffStr.split(",");
	var page = 1;
	var ofst = 0;
	var pageTxt = $('#myvocOfst option:selected').text();
	if(buffAry[2]!=''){
		page= (buffAry[2]/lmt)+1;
		pageTxt = '第' + page + '頁';		
		//alert('有buffer=>page=>'+pageTxt);
	}else{
		page = parseInt(pageTxt);
		ofst = lmt * (page - 1);
		//alert('沒有buffer=>page=>'+pageTxt);
	}
	$('#myvocOfst option[value!=""]').remove(); //清空所有選項
	for (var i = 1; i < ttlPages + 1; i++) {
		addOption('myvocOfst', '第' + i + '頁'); //加入選項
	}
	$("#myvocOfst").val(pageTxt).attr('selected', true); //選單停在選定頁數
}
function ttlReportReset(){
	$('#vpvid').text('');
	$('#vpuid').text('');
	$('#vprmk').val('');	
	$('#vp5').prop('checked', true); // Checks it
	$('#vp4, #vp6, #vp7').prop('checked', false); // Unchecks it
}
function ttlReport(_vid, _uid, _eng){	//回報總庫單字問題
	//alert(_uid + '_回報_' + _vid);
	$('#reportVoc').modal();
	$('#vpvid').text(_vid);
	$('#vpuid').text(_uid);
	$('#vpeng').text(_eng);	
}
function ttlReportSubmit(){
	//alert('submit');
	/*****vid,uid,enStr,rmk,en,ch,pos,kk*****/
	var infoAry=[];	
	infoAry[0] = escapeStr($('#vpvid').text());
	infoAry[1] = escapeStr($('#vpuid').text());
	infoAry[2] = escapeStr($('#vpeng').text());
	infoAry[3] = escapeStr($('#vprmk').val());
	
	for(var i=4; i<8; i++){
		if ($('#vp' + i).is(":checked")) {
			infoAry[i] = '1';
		}else{
			infoAry[i] = '0';
		}	
	}	
	var fnIfSuccess = function(data){
//alert(data);
		alert('我們會重新審查這個單字，感謝您的建議。');
		ttlReportReset();
		//doCookieSetup('orgEng',removePar(vTmp[0]));
	}	
	callPhpFn('ttlReportSubmit', infoAry, fnIfSuccess);	
}
function ttlfnBtn(_rowNum, _show){
	if(_show == '0'){
		$('#ttlReportBtn'+_rowNum).addClass('hidden');		
	}else if(_show == '1'){
		$('#ttlReportBtn'+_rowNum).removeClass('hidden');
	}
}
function trailVoc(vocName) {
	//alert("字庫= "+vocName);
	pasteHtmlToDiv('trailVoc', 'tgtDiv', vocName);
}
function tutorial(_obj){				//連結到新手教學特定DIV
//alert(_obj);
	if(_obj=='#tuTile9' || _obj=='#title11'){
		$('#fakeTitle').removeClass('hidden');
		$('#fakeContent').removeClass('hidden');		
	}else{
		$('#fakeTitle').addClass('hidden');
		$('#fakeContent').addClass('hidden');
	}
	$('html, body').animate({scrollTop: $(_obj).offset().top - 50 },500);
	return false;//防止畫面閃動		
}
function tutorialHighlight(tgtId, inOrOut){//in=1;out=0//標亮教學頁按鈕
	if(inOrOut==1){
		$('#'+tgtId).addClass('tHighlight');
	}else{
		$('#'+tgtId).removeClass('tHighlight');
	}	
}
function updateMemType(_ctr){
	//alert('updateMemtype'+_ctr);
	var userId  = $('#voc'+ _ctr).text().trim();
	var memType = $('#m' + _ctr +' option:selected').val();
	var fnIfSuccess = function(data){
		//alert(data);
	}	
	callPhpFn('updateUserInfo', [ 'mem_level', memType, userId] , fnIfSuccess);
	//alert('userId=>' + userId + '; memType=>' + memType);	
}

function userSetupCnfm(_page){			//儲存用戶設定頁面	
	if(_page==1){//個人資訊
		var fnIfSuccess1 = function (data) {
			$('#pwErrMsg').text('');
			window.location.reload();
		}	
		if(setupChanged()){
			$('#settingArea').modal('hide');
			callPhpFn("updateCols", [$('#userSetupNick').val(), $('#userSetupEmail').val(), $('input[name=userSetupLang]:checked').val(), $('#hourDiffSel option:selected').val()], fnIfSuccess1);
		}
	}else if(_page==2){//密碼設定
		var vPwAry = [];
		vPwAry[0] = "";//account;
		for (var i = 1; i < 4; i++) {
			vPwAry[i] = $('#pw' + (i - 1)).val();
		}
		var fnIfSuccess2 = function (data) {
			if (data.trim() == 'success') {
				$('#pwErrMsg').text('');
				for (var i = 1; i < 4; i++) {
					$('#pw' + (i - 1)).val("");
				}
				$('#settingArea').modal('hide');
			} else {								
				$('#pwErrMsg').text("原密碼錯誤或兩次新密碼不相符。請重新輸入。");
			}
		}
		if (vPwAry[1] != '' && vPwAry[2] != '' && vPwAry[3] != '') {
			if (vPwAry[2] == vPwAry[3]) {
				if(vPwAry[2].length<21 &&  vPwAry[2].length>5){
					callPhpFn('setting', vPwAry, fnIfSuccess2);
				}else{
					$('#pwErrMsg').text("新密碼長度請設定為6-20碼。");
				}
				
			} else {
				$('#pwErrMsg').text("原密碼錯誤或兩次新密碼不相符。請重新輸入。");
			}
		} else {
			$('#pwErrMsg').text("所有欄位均需要輸入");
		}
	}else if(_page==3){//偏好設定
		var fnIfSuccess3 = function (data) {	
//alert(data);		
			var tgtBuff;
			var buffStr;
			var tgtBuffStr;
			var buffAry;
			var buffAryLen;
			for(var j=0;j<5;j++){
				tgtBuff='';
				buffStr='';
				tgtBuffStr='';
				buffAry=[];
				buffAryLen=0;
				switch(j){
					case 0: tgtBuff= 'srchAllCons'	; break;
					case 1: tgtBuff= 'srchUsrBdCons'; break;
					case 2: tgtBuff= 'srchVjPkgCons'; break;
					case 3: tgtBuff= 'srchCstmCons'	; break;
					case 4: tgtBuff= 'srchTtlVocs'	; break;
				}
				buffStr	=	localStorage.getItem(tgtBuff);

				if(buffStr){
					buffAry =	buffStr.split(",");
				}
				
				//buffAry =	buffStr.split(" ");
//alert('bfrStr=>'+buffStr+' & bfrAry[0]=>'+ buffAry[0]);
				
				buffAryLen	=	buffAry.length;
				for( i=0; i<buffAryLen; i++ ){
					if(i==1){
						switch(defaultVocPerPage){
							case '0': vocPerPage='20'	; break;
							case '1': vocPerPage='50'	; break;
							case '2': vocPerPage='100'	; break;
						}					
						tgtBuffStr+=vocPerPage+',';
					}else if(i== (buffAryLen-1)){
						tgtBuffStr+=buffAry[i];
					}else{
						tgtBuffStr+=buffAry[i]+',';
					}				
				}
				localStorage.setItem(tgtBuff, tgtBuffStr);
//alert('tgtBuff= '+tgtBuff+ ' & buffStr= '+tgtBuffStr);
			}			
			window.location.reload(true);
		}
		$('#settingArea').modal('hide');
		var defaultPage 		=	$('#defaultPage option:selected').val();
		var defaultVocPerPage 	=	$('#defaultVocPerPage option:selected').val();
		var defaultDic			=	$('#defaultDic option:selected').val();
		var readingWinX			=	$('#rModeWidth').val();
		var readingWinY			=	$('#rModeHeight').val();
		var preferenceAryStr	=	defaultPage + "," + defaultVocPerPage+ "," + defaultDic + "," + readingWinX+ "," + readingWinY + ",0,0,0";

//alert('preferenceAryStr=>'+preferenceAryStr);
		localStorage.setItem("defaultVocPerPage", defaultVocPerPage);
//alert('lstorage=>'+localStorage.getItem("defaultVocPerPage"));
		callPhpFn("updatePref", preferenceAryStr, fnIfSuccess3);		
	}	
}

function enStringOptions(enTxt){		//更新可能單字選項-判斷英文可能字尾
	if(enTxt!=""){	
		if(/[A-Z]/.test( enTxt[0])){//首字大寫改小寫
			engStrAry.push(enTxt.toLowerCase());
		}
	}	
	enTxt = enTxt.toLowerCase();
	var x     = document.getElementById("vocENList");
	var f1 = enTxt.substr(enTxt.length - 1);
	var f2 = enTxt.substr(enTxt.length - 2);
	var f3 = enTxt.substr(enTxt.length - 3);
	var f4 = enTxt.substr(enTxt.length - 4);
	var p_1= enTxt.substr(0,enTxt.length-1);
	var p_2= enTxt.substr(0,enTxt.length-2);
	var p_3= enTxt.substr(0,enTxt.length-3);
	var p_4= enTxt.substr(0,enTxt.length-4);
	var L4 = enTxt.substr(enTxt.length-4,1);
	var L3 = enTxt.substr(enTxt.length-3,1);

	if(engBfSuff!=""){
		engStrAry.push(engBfSuff);
	}
	if(f3=="ing"){		
		if(isDbl(enTxt,5)){
			engStrAry.push(p_4);
		}else{
			engStrAry.push(p_3);
			if(L4!='y'){
				engStrAry.push(p_3+'e');
			}
		}		
	}
	
	//biggest
	//bigger
	//funniest
	//staying
	//finding
	//happier
	if(f3=="est"){		
		if(isDbl(enTxt,5)){
			engStrAry.push(p_4);
		}else{
			if(L4=='i'){
				engStrAry.push(p_4+'y');
			}else{
				engStrAry.push(p_3);
			}
		}		
	}
	if(f2=="er"){		
		if(isDbl(enTxt,4)){
			engStrAry.push(p_3);
		}else{
			engStrAry.push(p_2);
			if(L3=='i'){
				engStrAry.push(p_3+'y');
			}
		}		
	}	

	
	if(f1=="s"){	
		engStrAry.push(p_1);
	}
	if(f2=="es"){	
		engStrAry.push(p_2);
	}
	if(f3=="ies"){
		engStrAry.push(p_3+'y');
	}
	if(f2=="ed"){
		if(f3=="ied"){
			engStrAry.push(p_3+'y');
		}else{
			if(isDbl(enTxt,4)){
				engStrAry.push(p_3);
			}else{
				engStrAry.push(p_2);
				engStrAry.push(p_1);
			}
		}		
	}
	if(f4=="tion" || f4=="ness"){
		engStrAry.push(p_4);
	}
}
function chkTmpEn(){					//更新可能單字選項-新字判斷(非字尾變化)
	var enTxt=$('#vocEN').val().trim();
	

		var ct=0;		
		var aryLen	=	engStrAry.length;
		for(var i=0; i<aryLen; i++){
			if(enTxt == engStrAry[i]){			
				ct=ct+1;
				break;
			}	
		}	
		if(ct == 0){//表示這是新字
			engBfSuff	=	enTxt;
			engStrAry=[];
			$('#enBfs').text(engBfSuff);
			$('#vocENList option[value!=""]').remove();
			
			engStrAry.push('(變化字尾)');
			engStrAry.push(engBfSuff);			
			enStringOptions(engBfSuff);
			var sorted_arr = [];
			var sorted_arr = engStrAry.slice().sort();
			var results = [];
			for (var i = 0; i < engStrAry.length; i++) {
				if (sorted_arr[i + 1] != sorted_arr[i]) {
					results.push(sorted_arr[i]);
				}
			}
			finalSuffList(results);
		}else{
			finalSuffList(engStrAry);
		}	
	
}
function updateList(){					//更新可能單字選項-主程式
//alert("updating the list");
//alert('engStrAry=>'+engStrAry.toString());
	var enTxt	=	document.getElementById('vocEN').value;
	
	if(enTxt.trim()==""){
		$('#vocENList option[value!=""]').remove();		
	}else{
		var enBfs	=	$('#enBfs').text();
		if( enBfs==""){
			$('#enBfs').text(enTxt);
			engStrAry.push('(變化字尾)');
			engStrAry.push(enTxt);	
			$('#vocENList option[value!=""]').remove();	
			
			enStringOptions(enTxt);
			
			var sorted_arr = engStrAry.slice().sort();
			var results = [];

			for (var i = 0; i < engStrAry.length; i++) {
			
				if (sorted_arr[i + 1] != sorted_arr[i]) {
					results.push(sorted_arr[i]);
				}
			}
			finalSuffList(results);
			engStrAry	=	results.valueOf();
		}else{
			chkTmpEn();	
		}
		$("#vocENList option").each(function(){
			if ($(this).val() == "(變化字尾)") {
				$(this).attr("disabled", "disabled");
			}
		});		
	}
}
function finalSuffList(results){
	results=removeRedun(results);
//alert('vocEN=>'+$('#vocEN').val()+' & ary=>'+results.toString());
	$('#vocENList option[value!=""]').remove();	
	for(var i=0; i<results.length; i++){		
		if(results[i].trim()!=""){
			if($('#vocEN').val() != results[i] ){
				addOption("vocENList", results[i]);
			}			
		}				
	}
}
function removeRedun(_ary){
	var results=[];
	for (var i = 0; i < _ary.length; i++) {
		if (_ary[i + 1] != _ary[i]) {
			results.push(_ary[i]);
		}
	}	
	return results;
}

function updateReviewStatus(_ctr, _ttlreviewId){//更新檢舉報表狀態
	var fnIfSuccess = function (data) {
		$('#vjDicTr'+_ctr).addClass('hidden');
	}	
	callPhpFn('updateReviewStatus', _ttlreviewId , fnIfSuccess);
}
function updateViewerAct(){				//更新用戶行為紀錄
	var infoAry = [];
	var recStr = localStorage.getItem("behavior");
	infoAry[0] = localStorage.getItem("ip");
	infoAry[1] = recStr;
	infoAry[2] = localStorage.getItem("userId");
	infoAry[3] = localStorage.getItem("country");
	if (recStr != 'null' || recStr != '') {
	//if (recStr) {
		$.ajax({
			type : "POST",
			url : 'vocabPHPfn.php',
			async : true,
			data : {
				fnName : "viewerActRec",
				fnPar : infoAry
			},
			error : function (data) {
				
			},
			success : function (data) {
				localStorage.setItem("behavior", "");
				$('#showBhvrStr').text(localStorage.getItem("behavior"));				
			}
		});
	}
}
function updateCol( _ct, _colName){		//myvoc page update
	var vocId=$('#vocId'+_ct).val();
	var colVal=$('#'+_colName+_ct).val();
//alert('vocId=>'+vocId+'\ncolName=>'+_colName+'\ncolVal=>'+colVal);	
	var fnIfSuccess = function (data) {
//alert(data);
		//go2Front('link2');		
		upDateVocTbl('myvocOfst');		
	}
	callPhpFn('updateCol', [vocId, _colName, colVal], fnIfSuccess);
}
function updateVjDic(_ctr, _colName){
	var vocId = $('#vjDicId'+_ctr).val();
	var colVal= $('#vjDic'+_colName+_ctr).val();	
	var colVal= escapeStr(colVal).replace(/[\[\]\/\s]/g,'');
	//alert('vocId=>'+vocId+'\ncolName=>'+_colName+'\ncolVal=>'+colVal);
	var fnIfSuccess = function (data) {
		//alert(data);
		//location.reload();
	}
	callPhpFn('updateCol', [vocId, _colName, colVal, "vjDic"], fnIfSuccess);	
}
function updateOrgList(){
	var fnIfSuccess = function (data) {
		//alert(data);			
	}
	$orgList = localStorage.getItem("orgList");
	$ary     = $orgList.split('《§》');
//alert("orgList=>"+$orgList+"\n$ary0=>"+$ary[0]);
	var numCounter =0;
	var numCounter2=0; 
	while($ary[numCounter]!=undefined){
		numCounter+=1;//calculate total number of elements
	}
	if(document.getElementById('vocOri').value==''){
		document.getElementById('vocOri').value='(未定義)';		
	}		
	$org=trim(document.getElementById('vocOri').value);	
	
	if($org!=$ary[0]){//|| $org!='(未定義)',待處理
		//alert("更新了"+" & ary[0]=>"+$ary[0]+" ,org="+$org);
		var foundMark=0;	
		if(numCounter<10){//total elements are smaller than 10
			for(var i=0;i<numCounter;i++){
				if($org==$ary[i]){
					foundMark=1;
					$ary.splice(i,1);//if found, remove the element from its position
					$ary.unshift($org);//put the element at the beginning.
					numCounter2=numCounter;
					break;
				}		
			}			
			if(foundMark==0){
				if($org!="(未定義)"){
					$ary.unshift($org);//New one, put it at the beginning.
					numCounter2=numCounter+1;
				}					
			}
		}else{//total elements are 10
			numCounter2=10;
			for(var j=0;j<numCounter;j++){
				if($org==$ary[j]){
					foundMark=1;				
					$ary.splice(j,1);//if found, remove the element from its position
					$ary.unshift($org);//put the element at the beginning.					
					break;
				}			
			}			
			if(foundMark==0){
				if($org!="(未定義)"){
					$ary.pop();
					$ary.unshift($org);//New one, put it at the beginning.
				}
			}
			
		}	
		$orgListStr='';			
		for(var k=0;k<numCounter2;k++){
			//alert("ary=>"+$ary[k]);
			if(k==(numCounter2-1)){
				$orgListStr+=$ary[k];
			}else{
				$orgListStr+=$ary[k]+'《§》';	
			}				
		}
		if($orgListStr!=''){
			localStorage.setItem("orgList", $orgListStr);
//alert('orgListStr=>'+ $orgListStr);
			getOrgList();//make option list, according to orgListBfr		
			callPhpFn('updateUserInfo', ['orgList',$orgListStr], fnIfSuccess);
		}		
	}	
}	
function updateStorageDisplay() { 		//純測試用//顯示localStorage值
	$("#vLinkQ0").text(localStorage.getItem('srchAllCons'));
	$("#vLinkQ1").text(localStorage.getItem('srchUsrBdCons'));
	$("#vLinkQ2").text(localStorage.getItem('srchVjPkgCons'));
	$("#vLinkQ3").text(localStorage.getItem('srchCstmCons'));
	$("#vLinkQ4").text(localStorage.getItem('srchTtlVocs'));
}
function upDateVocTbl(_caller){
	var fnIfSuccess = function (data) {
		if(data.trim()=='沒cookie'){
			//showCookieExpiredModalAndLogout();
		}else{
			upDateVocTbl_part2(_caller);
		 }
	 }
	callPhpFn('chkCookie', '', fnIfSuccess);
}
function upDateVocTbl_part2(_caller) {	//由panel上的控制項啟動
	panelType = localStorage.getItem("panelType");
	switch (panelType) {
		case 'vocLink0': tgtBuff = 'srchAllCons'  ;	break; //全部單字
		case 'vocLink1': tgtBuff = 'srchUsrBdCons';	break; //自建單字
		case 'vocLink2': tgtBuff = 'srchVjPkgCons';	break; //本站單字
		case 'vocLink3': tgtBuff = 'srchCstmCons' ;	break; //自訂查詢
		case 'vocLink4': tgtBuff = 'srchTtlVocs'  ;	break; //全站單字
	}
	var buffStr = localStorage.getItem(tgtBuff);
	var buffAry = buffStr.split(",");
	var odr = $('#myvocOdr option:selected').val();
	var lmt = $('#myvoLmt option:selected').val();
	var ttlVocNums = parseInt($("#getTtlVocNums").text());
	var ttlPages = Math.ceil(ttlVocNums / lmt);
	$("#ttlPages").text(ttlPages + "頁");	
	var pageTxt = $('#myvocOfst option:selected').text();	
//alert('upDateVocTbl=>caller=>'+_caller+' & Page=>'+pageTxt+' & panelType='+panelType+' \n bufStr=>'+buffStr);
	var page = midNum(pageTxt, 1, 2);
	var ofst = lmt * (page - 1); 	
	
	if (_caller == 'myvoLmt') {
		$('#myvocOfst option[value!=""]').remove(); //清空所有選項
		for (var i = 1; i < ttlPages + 1; i++) {
			addOption('myvocOfst', '第' + i + '頁'); //加入選項
		}
		ofst = 0;
	} else if (_caller == 'myvocOdr') {
		ofst = 0;
	}	
	if(tempOffset != 0){
		ofst =tempOffset;
		tempOffset=0;
	}	
	var item0 = odr; //排序依據
	var item1 = lmt; //每頁字數
	var item2 = ofst; //offset
	if (buffAry[3] != '') {
		var item3 = buffAry[3]; //自訂查詢欄位1
	} else {
		var item3 = $('#myvocColName0 option:selected').val(); //自訂查詢欄位1
	}
	if (buffAry[4] != '') {
		var item4 = buffAry[4]; //自訂查詢條件1
	} else {
		var item4 = $('#myvocCndtn0 option:selected').val(); //自訂查詢條件1
	}
	if (buffAry[5] != '' && $('#myvocSrchStr0').val() == '') {
		var item5 = buffAry[5]; //自訂查詢字串1
	} else {
		var item5 = $('#myvocSrchStr0').val(); //自訂查詢字串1
	}
	if (buffAry[6] != '' ) {
		var item6 = buffAry[6]; //第一條件與第二條件關係/or/and
	} else {
		var item6 = $('input[name=srchRelation]:checked').val();
	}	
	if (buffAry[7] != '') {
		var item7 = buffAry[7]; //自訂查詢欄位2
	} else {
		var item7 = $('#myvocColName1 option:selected').val(); //自訂查詢欄位2
	}
	if (buffAry[8] != '') {
		var item8 = buffAry[8]; //自訂查詢欄位2
	} else {
		var item8 = $('#myvocCndtn1 option:selected').val(); //自訂查詢條件2
	}
	if (buffAry[9] != '' && $('#myvocSrchStr1').val() == '') {
		var item9 = buffAry[9]; //自訂查詢欄位2
	} else {
		var item9 = $('#myvocSrchStr1').val(); //自訂查詢字串2
	}
	if( _caller=='vocLink4'){
		var item10 = buffAry[10];	
	}else if( panelType=='vocLink4'){
		var item10 = 'vjDic';
	}else{
		var item10 = '';
	}
	var item11 = '';	
	var buffVarAry = [item0, item1, item2, item3, item4, item5, item6, item7, item8, item9, item10, item11];
	var bAryLen = buffVarAry.length;
	buffStr = "";
	
	for (var i = 0; i < bAryLen; i++) {
		buffStr += buffVarAry[i] + ",";
	}
	switch (panelType) {
		case 'vocLink0': tgtBuff = 'srchAllCons'  ; break; //全部單字
		case 'vocLink1': tgtBuff = 'srchUsrBdCons'; break; //自建單字
		case 'vocLink2': tgtBuff = 'srchVjPkgCons'; break; //本站單字
		case 'vocLink3': tgtBuff = 'srchCstmCons' ; break; //自訂查詢
		case 'vocLink4': tgtBuff = 'srchTtlVocs'  ; break; //全站單字
	}
	localStorage.setItem(tgtBuff, buffStr);
	updateStorageDisplay();	
	
	var fnIfSuccess=function(data){
//alert(data);
//alert('Offset=>'+buffVarAry[2]);
		document.getElementById('myvocTbl').innerHTML = data;
		if(localStorage.getItem("lang")=='chs'){tongwen_TtoS();}
		setWinHeight('whiteBack');
		if(lmt!=20){
			$("#footer").css("height", "80px");
		}else{
			var winInnerH = window.innerHeight;
			var footerH = winInnerH-661;
			var pxFooterH=footerH + "px";
			$("#footer").css("height", pxFooterH);
		}
	}	
	callPhpFn('updateVocTable', buffVarAry, fnIfSuccess);	
}
function updateSessionLastActTime() {	//更新最後存取時間
	var fnIfSuccess = function (data) {}
	callPhpFn('updateSessionLastActTime', ""	, fnIfSuccess);
}


function vocPreview(_pkgName, _range){	//預覽字庫單字-主程式
// var myVar100=50;
// var numabc="100";
// var abc=eval("myVar" + numabc);
// alert("abc:" +　abc);
	var vStr='';
	var vocAry=[];
	var arrayToLook;

	$('#vocPreviewPkgName').text(_pkgName);
	
	if(_range == '50'){
		arrayToLook= _pkgName +"_50Ary";
		$('#showAllVoc').removeClass('hidden');
	}else if(_range == '1000'){
		arrayToLook= _pkgName +"_1000Ary";
		$('#showAllVoc').addClass('hidden');
	}	
	
	if(localStorage.getItem(arrayToLook)){//alert('不用讀mysql');
		vStr	=	localStorage.getItem(arrayToLook);			
		pasteVocPreviewToDiv(vStr, _pkgName);
	}else{	
//alert('沒資料，要讀mysql');
		var fnIfSuccess = function (data) {
			vStr	=	data;		
			vStr	= 	vStr.substring(1);//vStr=vStr.substr(1,(vStr.length-1));		
			localStorage.setItem(arrayToLook , vStr);			
			pasteVocPreviewToDiv(vStr, _pkgName);
		}
		callPhpFn('vocPreviewTbl', [_pkgName, _range], fnIfSuccess);
	}
}
function pasteVocPreviewToDiv(_data, _pkgName){//預覽字庫單字-貼預覽單字到modal(含標題)
	var vStr	=	escapeStrBk(_data);
	var vAry1D	=	vStr.split('§');
	var vAry2D	=	[];
	vAry2D	=	str1Dto2D(vAry1D);
	var vStrHTML0='';
	var vStrHTML1='';
	vStrHTML0='<table><tr style="border:1px solid; width:auto;"><td class="vocPreview f0 vocPTD1" style="text-align: center;">序號</td><td class="vocPreview f0 vocPTD2">英文</td><td class="vocPreview f1 vocPTD3">中文</td><td class="vocPreview f0 vocPTD4" style="text-align: center;">序號</td><td class="vocPreview f0 vocPTD5">英文</td><td class="vocPreview f1 vocPTD6">中文</td></tr>';
	
	for(var i=0; i<(vAry2D.length)/2; i++){
		if(i%2==0){
			vStrHTML1+='<tr><td class="vocPreview f0" style="text-align: right; padding-right:7px;">'+ (i+1) + '</td><td class="vocPreview f0" style="padding-left:5px;">' + vAry2D[i][0] + '</td><td class="vocPreview f1">'+ vAry2D[i][1] + '</td>';			
		}else{
			vStrHTML1+='<td class="vocPreview f0" style="text-align: right; padding-right:7px;">' + (i+1) +'</td><td class="vocPreview f0" style="padding-left:5px;">' + vAry2D[i][0] +'</td><td class="vocPreview f1">'+ vAry2D[i][1] +'</td></tr>';
		}
	}
	if(i%2 == 1){
		vStrHTML1+='</tr>';
	}
	vStrHTML1+='</table>';	
	vStr	=	vStrHTML0+vStrHTML1;
	document.getElementById('vocPreviewContent').innerHTML = vStr;
	pkgName	=	pkgCodeToName(_pkgName);				
	$('#pkgPreTitle').text( '『' + pkgName + '』字庫預覽');
}
function str1Dto2D(_strAry1D){				//一維陣列轉二維陣列
	var vAry1D_len=_strAry1D.length;
	var vAry2D	=	[];
	var j=0;
	for(var i=0; i<vAry1D_len; i++){
		vAry2D[i]	=	[_strAry1D[j], _strAry1D[j+1]];
		j=j+2;
	}
	return vAry2D;
}


function vocENkeydown(){
	if(event.which == 13) {
		srchDef();		
	}	
}
function vocSearch(_caller){
	var fnIfSuccess = function (data) {
		if(data.trim()=='沒cookie'){
			//showCookieExpiredModalAndLogout();
		}else{
			vocSearch_part2(_caller);
		 }
	 }
	callPhpFn('chkCookie', '', fnIfSuccess);
}
function vocSearch_part2(_caller) { 	//由頁面上的linkMenu驅動		
//alert('caller=>'+_caller);
	var ttlvocReviewFlag=false;
	var _callerOrg=_caller;
	if(_caller	==	'vocLink5'){		
		_caller='vocLink4';
		
		var tgtIdStr=$('#ttlreviewIdStr').text().trim();//'9127《§》6302《§》2663';
//alert(tgtIdStr);	
		
		ttlvocReviewFlag=true;		
	}
	rootDisplay('link2');
	$('#rootForvocLink0' ).removeClass('epty');	
	recClickID(_caller);
	switch (_caller) {
		case 'link2'   :	tgtBuff = 'srchAllCons'; _caller='vocLink0';	  break;
		case 'vocLink0':	tgtBuff = 'srchAllCons';	  break; //全部單字
		case 'vocLink1':	tgtBuff = 'srchUsrBdCons';    break; //自建單字
		case 'vocLink2':	tgtBuff = 'srchVjPkgCons';    break; //本站單字
		case 'vocLink3':	tgtBuff = 'srchCstmCons';	  break; //自訂查詢
		case 'vocLink4':	tgtBuff = 'srchTtlVocs';	  break; //全站單字
	}	
	var buffStr = localStorage.getItem(tgtBuff);
//alert('vocSrch bufStr_get=>'+buffStr);
	if (buffStr == "" || buffStr == null) {
	//if (buffStr) {
//若localstorage沒有值，此處給初始值		
		var defaultWordNumQ = localStorage.getItem('defaultVocPerPage');
//alert(defaultWordNumQ);
		switch(defaultWordNumQ){
			case '0': defaultWordNum='20' ; break;
			case '1': defaultWordNum='50' ; break;
			case '2': defaultWordNum='100'; break;
		}			
		localStorage.setItem('srchAllCons'   , 'odr1,'	+defaultWordNum+',0,,,,,,,,,');
		localStorage.setItem('srchUsrBdCons' , 'odr1,'	+defaultWordNum+',0,colName3,cndtn3,1,,,,,,');
		localStorage.setItem('srchVjPkgCons' , 'odr1,'	+defaultWordNum+',0,colName3,cndtn4,1,,,,,,');
		localStorage.setItem('srchCstmCons'  , ','		+defaultWordNum+',,,,,,,,,,');		
		//odr1,20,0,colName0,cndtn4,jaskldfjskojua,srchRel1,colName0,cndtn0,,vjDic,All,
		if(!ttlvocReviewFlag){
//alert('flag=>'+ttlvocReviewFlag+' & caller=>'+_caller);
			localStorage.setItem('srchTtlVocs'   , 'odr1,100,0,colName0,cndtn4,jaskldfjskojua,srchRel1,colName0,cndtn0,,vjDic,All,');
		}else{
			localStorage.setItem('srchTtlVocs'   , 'odr1,100,0,colName0,cndtn4,jaskldfjskojua,srchRel1,colName0,cndtn0,,vjDic,ttlvocReview,'+ tgtIdStr);
			//要修這裡的參數 才能顯示待修的總庫單字
		}
		
		
		
		buffStr = localStorage.getItem(tgtBuff);
//alert("vocSrch buffStr=空，給初始值= "+buffStr);
	} else {
		
		if(_callerOrg=='vocLink5'){
			
			
			
			localStorage.setItem('srchTtlVocs'   , 'odr1,100,0,colName0,cndtn4,jaskldfjskojua,srchRel1,colName0,cndtn0,,vjDic,ttlvocReview,'+ tgtIdStr);
		}		
		buffStr = localStorage.getItem(tgtBuff);
//alert('vocSrch bufStr不等於空=>'+buffStr);
		//alert("buffStr= "+buffStr);
	}
	var buffAry = buffStr.split(",");
//alert('bAry=>'+buffAry[11]);
	var fnVar   = buffAry;

	var fnIfSuccess = function (data) {
//$('#srchMsg').removeClass('hidden');
		for(var i=0; i<7; i++){
			linkHover(0, 'link'+i);
		}
		if(_caller=="vocLink0" || _caller=="vocLink1" || _caller=="vocLink2" || _caller=="vocLink3" || _caller=="vocLink4"){
			linkHover(1, "link2");
		}else{
			linkHover(0, "link2");
		}		
		//pasteVocTbl(fnVar, data, _caller);//傳入fnVar變數 及 myvoc外框、panel
		document.getElementById('rootForlink2').innerHTML =data;
if(localStorage.getItem("lang")=='chs'){tongwen_TtoS();}
		setPanelType(_caller);		
		localStorage.setItem("panelType", _caller);
		renewPanel(fnVar, _caller);
		updateStorageDisplay();//純測試用//顯示localStorage值
		setWinHeight('whiteBack');
		ttlPageDefault();
		resizeVJFooter(_caller);
	}
	callPhpFn('myvoc', fnVar , fnIfSuccess); //先執行--這裡寫要給myvoc的參數
}
function vjTubePlay(_src, _tgtId){
	//alert('src=>'+_src);
	//alert('tgtId=>'+_tgtId);
	src = _src;//$i.data('src');
	$('#'+_tgtId).html('<iframe width="946" height="532" scrolling="no" src="'+src+'"></iframe>');	
}
function vocNoMp3(){					//秀沒錄音的單字
	var vocNoMP3Str = $('#vocNoMp3_span').text();
	var ary = vocNoMP3Str.split(";");	
	$('#vocNoMP3Tgt').text(vocNoMP3Str);
	$('#noMP3ctr').text((ary.length)-1);	
}




function vSubOn(onOrOff, _tgtId) { 		//次選單hover效果
//alert("status: "+onOrOff+" & target: "+_tgtId);
	if (onOrOff == 1)
		$('#'+_tgtId).removeClass('hidden');
		//$(btnName).css('background','#237cf9');
	if (onOrOff == 0)
		$('#'+_tgtId).addClass('hidden');
}
function validateEmail(email) {
    var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
    return re.test(email);
}
function validatePw(pw) {
    var chkPw=true;
	//var pattern=/[^\[\]%^&'"`~!#$*)(=;:,\/\\{}]/g;	
	if(pw.length<6){
		chkPw=false;
	}	
	//alert(pattern.test(pw));
	return chkPw;
}
function vjSetFocus(){	
	var tgtId = $('#tgtHolder').val();
	setTimeout(function(){$('#'+tgtId).focus();},0);
	//alert("idStr=>"+idStr);	
}
function wireUpEvents() {				//偵測關閉分頁//最上面還有一個var  
  var dont_confirm_leave = 0; //set dont_confirm_leave to 1 when you want the user to be able to leave without confirmation
// var leave_message = 'You sure you want to leave?'
  function goodbye(e) {
	dicNewWindow.close();
	
	
	/*if (!validNavigation) {
      if (dont_confirm_leave!==1) {
        if(!e) e = window.event;
        //e.cancelBubble is supported by IE - this will kill the bubbling process.
        e.cancelBubble = true;
        e.returnValue = leave_message;
        //e.stopPropagation works in Firefox.
        if (e.stopPropagation) {
          e.stopPropagation();
          e.preventDefault();
        }
        //return works for Chrome and Safari
        return leave_message;
		//
      }
    }*/
  }
  window.onbeforeunload=goodbye; 
  // Attach the event keypress to exclude the F5 refresh
  $(document).bind('keypress', function(e) {
    if (e.keyCode == 116){
      validNavigation = true;
    }
  }); 
  // Attach the event click for all links in the page
  $("a").bind("click", function() {
    validNavigation = true;
  }); 
  // Attach the event submit for all forms in the page
  $("form").bind("submit", function() {
    validNavigation = true;
  }); 
  // Attach the event click for all inputs in the page
  $("input[type=submit]").bind("click", function() {
    validNavigation = true;
  }); 
}
function windowResize(){				//調整Popup閱讀視窗尺寸
	//alert('click');
	readingWindow.resizeTo(readingWinWidth, readingWinHeight); //715,755
    readingWindow.focus();
	readingWindow.onload = function () {
		readingWindow.document.getElementById('blderBlck').className = "bldrBlckP0 bldrBlckP2";
	};
}
//*********************
//以下4個函數是控制JS餅乾用
function doCookieSetup(name, value) {
  var expires = new Date();
  //有效時間保存 2 天 2*24*60*60*1000
  expires.setTime(expires.getTime() + 172800000);
  document.cookie = name + "=" + escape(value) + ";expires=" + expires.toGMTString() + ';path=/';
}
function getCookie(name) {
  var arg = escape(name) + "=";
  var nameLen = arg.length;
  var cookieLen = document.cookie.length;
  var i = 0;
  while (i < cookieLen) {//&lt;
    var j = i + nameLen;
    if (document.cookie.substring(i, j) == arg) return getCookieValueByIndex(j);
    i = document.cookie.indexOf(" ", i) + 1;
    if (i == 0) break;
  }
  return null;
}
function getCookieValueByIndex(startIndex) {
  var endIndex = document.cookie.indexOf(";", startIndex);
  if (endIndex == -1) endIndex = document.cookie.length;
  return unescape(document.cookie.substring(startIndex, endIndex));
}
function delCookie(name) {
  var exp = new Date();
  exp.setTime(exp.getTime() - 1);
  var cval = getCookie(name);
  document.cookie = escape(name) + "=" + cval + "; expires=" + exp.toGMTString();
}
//*********************
