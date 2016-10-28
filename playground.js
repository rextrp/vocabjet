/******/
function escapeStr(_str){			//替換字串中奇怪符號
	var str1= _str.replace(/'/g,"╪");
	str1= str1.replace(/"/g,'┴');
	str1= str1.replace(/\|\/|\{|\}|\\/g,"└");//替換這些符號:   /   \   {  }  `
	str1= str1.replace(/`/g,"♀");
	str1= str1.replace(/ˈ/g,"╪");
	str1= str1.replace(/\./g,"⊙");
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
		//str1=str1.replace(/㊣/g,'');
		return str1;
	}else{
		return "";
	}	
}

var testStr= null;
if( testStr == null ){
	console.log("test string has a value of Null.");
}else{
	console.log("not null");
}