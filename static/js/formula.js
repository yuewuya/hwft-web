function getBD(card) {

    let res = {};

    card.diameter = card.diameter*1 + card.compositeBoard*1;
    card.thickness = card.thickness*1;
    card.straightEdge = card.straightEdge*1;
    card.thickness = card.thickness*1;
    card.thickness = card.thickness*1;
    res.flag = true;
    if(card.shape == "HH"){
        card.diameter = card.diameterStandard && card.diameterStandard == 1 ? card.diameter : card.diameter - card.thickness;
        res.height = card.diameter/2 + card.straightEdge;
        res.heightStandard = 1;
        if(card.processingMethod == "冷冲压"){
            card.straightEdge = card.straightEdge < 20 ? 20 : card.straightEdge;
            let bl = 0;
            if(card.diameter <= 300){
                bl = 30;
            }else if(300 < card.diameter && card.diameter <= 750){
                bl = 50;
            }else if(750 < card.diameter && card.diameter <= 1000){
                bl = 60;
            }else{
                bl = 80;
            }
            res.cutting1 = 1.414 * Math.sqrt((card.diameter + card.thickness)*(card.diameter + card.thickness) + 2*(card.diameter + card.thickness)*(card.straightEdge + bl));
            return res;
        } else if(card.processingMethod == "热冲压"){
            card.straightEdge = card.straightEdge < 30 ? 30 : card.straightEdge;
            let x = 1.011 * card.diameter + card.thickness;
            let a = 0;
            if(card.thickness / card.diameter > 0.03){
                a = 40;
            }else {
                let temp = 2 * card.thickness;
                a = temp < 50 ? 50 : (temp > 100 ? 100 : temp);
            }
            res.cutting1 = 2 * Math.sqrt(0.5 * x * x + (card.straightEdge + a) * x);
            return res;
        }
    }else if(card.shape == "FH"){
        card.diameter = card.diameterStandard && card.diameterStandard == 1 ? card.diameter : card.diameter - card.thickness;
        res.height = card.straightEdge + card.littleR;
        res.heightStandard = 1;
        if(card.processingMethod == "冷冲压"){
            if(card.littleR < 3 * card.thickness){
                res.flag = false;
                res.msg = "不能冲压";
            }else {
                card.straightEdge = card.straightEdge < 10 ? 10 : card.straightEdge;
                let a = 4 * card.thickness < 30 ? 30 : 4 * card.thickness;
                card.littleR = card.littleR >= 3 * card.thickness ? card.littleR : 3 * card.thickness;
                res.cutting1 = Math.sqrt((card.diameter - 2 * card.littleR + (card.littleR + card.thickness/2) * 3.1416) * (card.diameter - 2 * card.littleR + (card.littleR + card.thickness/2) * 3.1416) + 4 * (card.diameter + card.thickness) * (card.straightEdge + a));
            }
            return res;
        }else if(card.processingMethod == "冷旋压" || card.processingMethod == "热旋压"){
            if(card.processingMethod == "冷旋压"){
                if(card.diameter < 900 || card.littleR < 3 * card.thickness){
                    res.flag = false;
                    res.msg = "不能旋";
                    return res;
                }
            }
            card.diameter = card.diameter > 900 ? card.diameter : 900;
            card.littleR = card.littleR > 3 * card.thickness ? card.littleR : 3 * card.thickness;
            let cutting = card.diameter - 2 * card.littleR + 3.1416 * (card.littleR + card.thickness / 2) + 2* card.straightEdge + 20;
            cutting = (cutting > 8 && cutting < 100) ? cutting + card.thickness : cutting;
            if(card.processingMethod == "冷旋压") {
                res.cutting1 = cutting;
            }else {
                res.cutting1 = cutting - 20 + 2 * card.thickness;
            }
            return res;
        }
    }else if(card.shape == "EHA"){
        if(card.processingMethod == "热冲压"){
            card.straightEdge = card.straightEdge >= 25 ? card.straightEdge : 25;
            let a = 0;
            if(card.diameter <= 600){
                a = card.thickness < 35 ? 40 : 50;
            }else if(card.diameter > 600 && card.diameter <= 950){
                a = card.thickness < 40 ? 50 : (card.thickness >= 80 ? 100 : 1.5 * card.thickness);
            }else if(card.diameter > 950 && card.diameter < 1750){
                a = card.thickness < 40 ? 50 : (card.thickness >= 80 ? 100 : 1.5 * card.thickness);
            }else {
                a = card.thickness < 50 ? 50 : (card.thickness > 100 ? 100 : 2 * card.thickness);
            }
            if (card.diameterStandard && card.diameterStandard == 1){
                res.cutting1 = 2 * Math.sqrt((1.011 * card.diameter + card.thickness) * (1.011 * card.diameter + card.thickness) * 0.345 + (1.011 * card.diameter + card.thickness) * (card.straightEdge + a));
            }else {
                card.diameter = card.diameter - 2 * card.thickness;
                res.cutting1 = 2 * Math.sqrt((1.011 * card.diameter + card.thickness)*(1.011* card.diameter + card.thickness)* 0.345 + (1.011 * card.diameter + card.thickness)*(card.straightEdge + a));
            }
            return res;
        }
    }else if(card.shape == "DHB"){
        if(card.processingMethod == "热冲压"){
            card.straightEdge = card.straightEdge >= 25 ? card.straightEdge : 25;
            let a = 0;
            if(card.diameter <= 600){
                a = card.thickness < 35 ? 40 : 50;
            }else if(card.diameter > 600 && card.diameter <= 950){
                a = card.thickness < 40 ? 50 : (card.thickness >= 80 ? 100 : 1.5 * card.thickness);
            }else if(card.diameter > 950 && card.diameter < 1750){
                a = card.thickness < 40 ? 50 : (card.thickness >= 80 ? 100 : 1.5 * card.thickness);
            }else {
                a = card.thickness < 50 ? 50 : (card.thickness > 100 ? 100 : 2 * card.thickness);
            }
            if (card.diameterStandard && card.diameterStandard == 1){
                res.cutting1 = 2 * Math.sqrt((1.011 * card.diameter + card.thickness) * (1.011 * card.diameter + card.thickness) * 0.345 + (1.011 * card.diameter + card.thickness) * (card.straightEdge + a));
            }else {
                card.diameter = card.diameter - 2 * card.thickness;
                res.cutting1 = 2 * Math.sqrt((1.011 * card.diameter + card.thickness)*(1.011* card.diameter + card.thickness)* 0.345 + (1.011 * card.diameter + card.thickness)*(card.straightEdge + a));
            }
            return res;
        }
    }
}


/*function getWeight(card) {
    if(card.shape == '' || !card.processingMethod || card.diameter == '' || card.thickness == '' || card.straightEdge == ''){
        return {flag: false, msg: "请完善数据"};
    }
    let endData = getBD(card);
    let cutting = card.cutting1*1;
    let thickness = card.thickness*1;
    if (card.materialId && card.materialId != ''){
        ajaxPostInvoke("/base/materialInfo", {id: card.materialId}, function (res) {
            endData.weight = (cutting / 2000) * (cutting / 2000)  * 3.1416 * thickness * (res.proportion*1);
            $("#cutting1").val(endData.cutting1);
            $("#weight").val(endData.weight);
        })
    }else {
        $("#cutting1").val(endData.cutting1);
        $("#weight").val(endData.weight);
    }
}*/

function getHeight(){
    let card = $("#saveForm").getData();
    let res = {};
    let shape = card.shape;
    let diameter = card.diameter *1 + card.compositeBoard*1;
    let thickness = card.thickness *1;
    let straightEdge = card.straightEdge *1;
    let diameterStandard = card.diameterStandard;
    if(shape == "EHA"){
        diameter = (diameterStandard && diameterStandard == 1) ? diameter : (diameter - thickness);
        res.height = diameter / 4 + straightEdge;
        res.heightStandard = true;
        $("#heightStandard").switchbutton("check");
        $("#height").val(res.height);
    }else if(shape == "EHB"){
        diameter = (diameterStandard && diameterStandard == 1) ? (diameter + thickness) : diameter;
        res.height = diameter / 4 + straightEdge;
        res.heightStandard = false;
        $("#heightStandard").switchbutton("uncheck");
        $("#height").val(res.height);
    }else if(shape == "THA"){
        diameter = (diameterStandard && diameterStandard == 1) ? diameter : (diameter - thickness);
        res.height = diameter * 0.194 + straightEdge;
        res.heightStandard = true;
        $("#heightStandard").switchbutton("check");
        $("#height").val(res.height);
    }else if(shape == "THB"){
        diameter = (diameterStandard && diameterStandard == 1) ? (diameter + thickness) : diameter;
        res.height = diameter *0.194 + straightEdge;
        res.heightStandard = false;
        $("#heightStandard").switchbutton("uncheck");
        $("#height").val(res.height);
    }else  if(shape == "DHA"){
        diameter = (diameterStandard && diameterStandard == 1) ? diameter : (diameter - thickness);
        res.height = diameter * 0.225 + straightEdge;
        res.heightStandard = true;
        $("#heightStandard").switchbutton("check");
        $("#height").val(res.height);
    } else if(shape == "FH"){
        res.height = card.littleR * 1 + straightEdge;
        res.heightStandard = true;
        $("#heightStandard").switchbutton("check");
        $("#height").val( res.height);
    }
    return res;
}

function pdzt(shape) {
    return shape.indexOf("CH") == 0 ? true : false;
}

function getZTCC(card) {
    let res = {
        diameter: card.diameter * 1,
        straightEdge: card.straightEdge * 1,
        downDiameter: card.downDiameter * 1,
        downStraight: card.downStraight * 1,
        bigR: card.bigR * 1,
        littleR: card.littleR * 1,
        thickness: card.thickness * 1,
        coneAngle: card.coneAngle * 1
    };
    let szb = card.straightEdge && card.straightEdge != 0 ? true : false;
    let xzb = card.downStraight && card.downStraight != 0 ? true : false;
    let nj = card.diameterStandard && card.diameterStandard == 1 ? true : false;
    let xpk = card.downGroove && card.downGroove != '' ? 1 : 0;
    if(szb && xzb){
        if(nj){
            let C12 = ((res.diameter-res.downDiameter)/2+(res.littleR+res.bigR+res.thickness)*(Math.cos(num2jd(res.coneAngle/2))-1))/Math.sin(num2jd(res.coneAngle/2));
            let C11 = res.straightEdge+res.downStraight+Math.sin(num2jd(res.coneAngle/2))*(res.bigR+res.littleR+res.thickness)+C12*Math.cos(num2jd(res.coneAngle/2));
            let C14 = (2*res.thickness<=20 ? 20 : (2*res.thickness<=30 ? 2*res.thickness : 30));
            let C13 = res.coneAngle/360*3.1416*(res.bigR+res.littleR+res.thickness)+res.straightEdge+res.downStraight+C12+2*C14;
            let C15 = res.downDiameter/2+res.thickness/2+(res.littleR+res.thickness/2)*(1-Math.cos(num2jd(res.coneAngle/2)));
            let C16 = 3.1416*(res.littleR+res.thickness/2)*res.coneAngle/360+res.downStraight+C14;
            let C17 = 3.1416*(res.bigR+res.thickness/2)*res.coneAngle/360+res.straightEdge+C14;
            let C18 = C15/Math.sin(num2jd(res.coneAngle/2))-C16;
            let C19 = C18+C13;
            let C20 = 360*Math.sin(num2jd(res.coneAngle/2));
            let C21 = C19*(1-Math.cos(num2jd(C20/2)));
            let C22 = C18*(1-Math.cos(num2jd(C20/2)))+C19-C18;
            let C23 = 2*C18*Math.sin(num2jd(C20/2));
            let C24 = 2*(C13+C18)*Math.sin(num2jd(C20/2));
            let C25 = C19*Math.sin(num2jd(res.coneAngle/2))*2-Math.cos(num2jd(res.coneAngle/2))*res.thickness;
            let C26 = C18*Math.sin(num2jd(res.coneAngle/2))*2-res.thickness*Math.cos(num2jd(res.coneAngle/2));
            let C27 = C13*Math.cos(num2jd(res.coneAngle/2));

            res.height = C11.toFixed(0);
            res.jsDiameter = C25.toFixed(0);
            res.jsHeight = C27.toFixed(0);
            res.jsDownDiameter = C26.toFixed(0);
            res.jsBjd = C20.toFixed(1);
            res.jsBbigR = C19.toFixed(0);
            res.jsBheight1 = C22.toFixed(0);
            res.jsBheight2 = C21.toFixed(0);
            res.jsBlittleR = C18.toFixed(0);
            res.jsBdiameter = C23.toFixed(0);

            res.jsBdownDiameter = C24.toFixed(0);
            return res;
        }else {
            let C3 = res.diameter - 2 * res.thickness;
            let C4 = res.downDiameter - 2 * res.thickness;
            let C5 = res.straightEdge;
            let C6 = res.downStraight;
            let C7 = res.bigR;
            let C8 = res.littleR;
            let C9 = res.thickness;
            let C10 = res.coneAngle;
            let C12 = ((C3-C4)/2+(C7+C8+C9)*(Math.cos(num2jd(C10/2))-1))/Math.sin(num2jd(C10/2));
            let C11 = C5+C6+Math.sin(num2jd(C10/2))*(C7+C8+C9)+C12*Math.cos(num2jd(C10/2));
            let C14 = 2*C9<=20 ? 20 : (2*C9<=30 ? 2*C9 : 30);
            let C13 = C10/360*3.1416*(C7+C8+C9)+C5+C6+C12+2*C14;
            let C15 = C4/2+C9/2+(C8+C9/2)*(1-Math.cos(num2jd(C10/2)));
            let C16 = 3.1416*(C8+C9/2)*C10/360+C6+C14;
            let C17 = 3.1416*(C7+C9/2)*C10/360+C5+C14;
            let C18 = C15/Math.sin(num2jd(C10/2))-C16;
            let C19 = C18+C13;
            let C20 = 360*Math.sin(num2jd(C10/2));
            let C21 = C19*(1-Math.cos(num2jd(C20/2)));
            let C22 = C18*(1-Math.cos(num2jd(C20/2)))+C19-C18;
            let C23 = 2*C18*Math.sin(num2jd(C20/2));
            let C24 = 2*(C13+C18)*Math.sin(num2jd(C20/2));
            let C25 = C19*Math.sin(num2jd(C10/2))*2+Math.cos(num2jd(C10/2))*C9;
            let C26 = C18*Math.sin(num2jd(C10/2))*2+C9*Math.cos(num2jd(C10/2));
            let C27 = C13*Math.cos(num2jd(C10/2));

            res.height = C11.toFixed(0);
            res.jsDiameter = C25.toFixed(0);
            res.jsHeight = C27.toFixed(0);
            res.jsDownDiameter = C26.toFixed(0);
            res.jsBjd = C20.toFixed(1);
            res.jsBbigR = C19.toFixed(0);
            res.jsBheight1 = C22.toFixed(0);
            res.jsBheight2 = C21.toFixed(0);
            res.jsBlittleR = C18.toFixed(0);
            res.jsBdiameter = C23.toFixed(0);
            res.jsBdownDiameter = C24.toFixed(0);

            return res;
        }
    }else if(szb && !xzb) {

        if(nj){
            let C11 = ((res.diameter-res.downDiameter)/2+res.bigR*(Math.cos(num2jd(res.coneAngle/2))-1))/Math.sin(num2jd(res.coneAngle/2));
            let C10 = res.straightEdge+(res.bigR+res.thickness)*Math.sin(num2jd(res.coneAngle/2))+C11*Math.cos(num2jd(res.coneAngle/2));
            let C13 = 2*res.thickness<=20 ? 20 : (2*res.thickness<=30 ? 2*res.thickness : 30);
            let C14 = res.downDiameter/2+res.thickness/2*Math.cos(num2jd(res.coneAngle/2));
            let C15 = xpk == 0 ? 0 : (2*res.thickness<=20 ? 20 : (2*res.thickness<=30 ? 2*res.thickness : 30));
            let C12 = 3.1416*res.coneAngle/360*(res.bigR+res.thickness/2)+res.straightEdge+C11+C13+C15;
            let C16 = 3.1416*(res.bigR+res.thickness/2)*res.coneAngle/360+res.straightEdge+C13;
            let C25 = xpk == 0 ? (C14*2-Math.cos(num2jd(res.coneAngle/2))*res.thickness) : ((C14-C15*Math.sin(num2jd(res.coneAngle/2)))*2-Math.cos(num2jd(res.coneAngle/2))*res.thickness);
            let C17 = (C25+Math.cos(num2jd(res.coneAngle/2))*res.thickness)/Math.sin(num2jd(res.coneAngle/2))/2;
            let C18 = C12+C17;
            let C19 = 360*Math.sin(num2jd(res.coneAngle/2));
            let C20 = C18*(1-Math.cos(num2jd(C19/2)));
            let C21 = C17*(1-Math.cos(num2jd(C19/2)))+C18-C17;
            let C22 = 2*C17*Math.sin(num2jd(C19/2));
            let C23 = 2*C18*Math.sin(num2jd(C19/2));
            let C24 = C18*Math.sin(num2jd(res.coneAngle/2))*2-res.thickness*Math.cos(num2jd(res.coneAngle/2));
            let C26 = C12*Math.cos(num2jd(res.coneAngle/2));

            res.height = C10.toFixed(0);
            res.jsDiameter = C24.toFixed(0);
            res.jsHeight = C26.toFixed(0);
            res.jsDownDiameter = C25.toFixed(0);
            res.jsBjd = C19.toFixed(1);
            res.jsBbigR = C18.toFixed(0);
            res.jsBheight1 = C21.toFixed(0);
            res.jsBheight2 = C20.toFixed(0);
            res.jsBlittleR = C17.toFixed(0);
            res.jsBdiameter = C22.toFixed(0);

            res.jsBdownDiameter = C23.toFixed(0);
            return res;
        }else{
            let C3 = res.diameter - 2 * res.thickness;
            let C4 = res.downDiameter - 2 * res.thickness * Math.cos(num2jd(res.coneAngle / 2));
            let C5 = res.straightEdge;
            let C6 = res.bigR;
            let C7 = res.thickness;
            let C8 = res.coneAngle;
            let C11 = ((C3-C4)/2+C6*(Math.cos(num2jd(C8/2))-1))/Math.sin(num2jd(C8/2));
            let C10 = C5+(C6+C7)*Math.sin(num2jd(C8/2))+C11*Math.cos(num2jd(C8/2));
            let C13 = 2*C7<=20 ? 20 : (2*C7<=30 ? 2*C7 : 30);
            let C14 = C4/2+C7/2*Math.cos(num2jd(C8/2));
            let C15 = xpk==0 ? 0: (2*C7<=20 ? 20 : (2*C7<=30 ? 2*C7 : 30));
            let C12 = 3.1416*C8/360*(C6+C7/2)+C5+C11+C13+C15;
            let C16 = 3.1416*(C6+C7/2)*C8/360+C5+C13;
            let C25 = xpk==0 ? (C14*2-Math.cos(num2jd(C8/2))*C7+2*C7*Math.cos(num2jd(C8/2))) : ((C14-C15*Math.sin(num2jd(C8/2)))*2-Math.cos(num2jd(C8/2))*C7+2*C7*Math.cos(num2jd(C8/2)));
            let C17 = (C25-Math.cos(num2jd(C8/2))*C7)/Math.sin(num2jd(C8/2))/2;
            let C18 = C12+C17;
            let C19 = 360*Math.sin(num2jd(C8/2));
            let C20 = C18*(1-Math.cos(num2jd(C19/2)));
            let C21 = C17*(1-Math.cos(num2jd(C19/2)))+C18-C17;
            let C22 = 2*C17*Math.sin(num2jd(C19/2));
            let C23 = 2*C18*Math.sin(num2jd(C19/2));
            let C24 = C18*Math.sin(num2jd(C8/2))*2+C7*Math.cos(num2jd(C8/2));
            let C26 = C12*Math.cos(num2jd(C8/2));

            res.height = C10.toFixed(0);
            res.jsDiameter = C24.toFixed(0);
            res.jsHeight = C26.toFixed(0);
            res.jsDownDiameter = C25.toFixed(0);
            res.jsBjd = C19.toFixed(1);
            res.jsBbigR = C18.toFixed(0);
            res.jsBheight1 = C21.toFixed(0);
            res.jsBheight2 = C20.toFixed(0);
            res.jsBlittleR = C17.toFixed(0);
            res.jsBdiameter = C22.toFixed(0);
            res.jsBdownDiameter = C23.toFixed(0);

            return res;
        }

    }else if (!szb && xzb){

        if(nj){
            let C10 = ((res.diameter-res.downDiameter)/2-(res.littleR+res.thickness)*(1-Math.cos(num2jd(res.coneAngle/2))))/Math.sin(num2jd(res.coneAngle/2));
            let C9 = res.downStraight+Math.sin(num2jd(res.coneAngle/2))*(res.littleR+res.thickness)+C10*Math.cos(num2jd(res.coneAngle/2));
            let C12 = 2*res.thickness<=20 ? 20 : (2*res.thickness<=30 ? 2*res.thickness : 30);
            let C11 = res.coneAngle/360*3.141592654*(res.littleR+res.thickness/2)+res.downStraight+C10+2*C12;
            let C13 = res.downDiameter/2+res.thickness/2+(res.littleR+res.thickness/2)*(1-Math.cos(num2jd(res.coneAngle/2)));
            let C14 = 3.141592654*(res.littleR+res.thickness/2)*res.coneAngle/360+res.downStraight+C12;
            let C15 = C12;
            let C16 = C13/Math.sin(num2jd(res.coneAngle/2))-C14;
            let C17 = C16+C11;
            let C18 = 360*Math.sin(num2jd(res.coneAngle/2));
            let C19 = C17*(1-Math.cos(num2jd(C18/2)));
            let C20 = C16*(1-Math.cos(num2jd(C18/2)))+C17-C16;
            let C21 = 2*C16*Math.sin(num2jd(C18/2));
            let C22 = 2*(C11+C16)*Math.sin(num2jd(C18/2));
            let C23 = C17*Math.sin(num2jd(res.coneAngle/2))*2-Math.cos(num2jd(res.coneAngle/2))*res.thickness;
            let C24 = C16*Math.sin(num2jd(res.coneAngle/2))*2-res.thickness*Math.cos(num2jd(res.coneAngle/2));
            let C25 = C11*Math.cos(num2jd(res.coneAngle/2));

            res.height = C9.toFixed(0);
            res.jsDiameter = C23.toFixed(0);
            res.jsHeight = C25.toFixed(0);
            res.jsDownDiameter = C24.toFixed(0);
            res.jsBjd = C18.toFixed(1);
            res.jsBbigR = C17.toFixed(0);
            res.jsBheight1 = C20.toFixed(0);
            res.jsBheight2 = C19.toFixed(0);
            res.jsBlittleR = C16.toFixed(0);
            res.jsBdiameter = C21.toFixed(0);
            res.jsBdownDiameter = C22.toFixed(0);

            return res;
        }else{
            let C3 = res.diameter - 2 * res.thickness * Math.cos(num2jd(res.coneAngle / 2));
            let C4 = res.downDiameter - 2 * res.thickness;
            let C5 = res.littleR;
            let C6 = res.downStraight;
            let C7 = res.thickness;
            let C8 = res.coneAngle;
            let C10 = ((C3-C4)/2-(C5+C7)*(1-Math.cos(num2jd(C8/2))))/Math.sin(num2jd(C8/2));
            let C9 = C6+Math.sin(num2jd(C8/2))*(C5+C7)+C10*Math.cos(num2jd(C8/2));
            let C12 = 2*res.thickness<=20 ? 20 : (2*res.thickness<=30 ? 2*res.thickness : 30);
            let C11 = C8/360*3.141592654*(C5+C7/2)+C6+C10+2*C12;
            let C13 = C4/2+C7/2+(C5+C7/2)*(1-Math.cos(num2jd(C8/2)));
            let C14 = 3.141592654*(C5+C7/2)*C8/360+C6+C12;
            let C15 = C12;
            let C16 = C13/Math.sin(num2jd(C8/2))-C14;
            let C17 = C16+C11;
            let C18 = 360*Math.sin(num2jd(C8/2));
            let C19 = C17*(1-Math.cos(num2jd(C18/2)));
            let C20 = C16*(1-Math.cos(num2jd(C18/2)))+C17-C16;
            let C21 = 2*C16*Math.sin(num2jd(C18/2));
            let C22 = 2*(C11+C16)*Math.sin(num2jd(C18/2));
            let C23 = C17*Math.sin(num2jd(res.coneAngle/2))*2-Math.cos(num2jd(res.coneAngle/2))*res.thickness;
            let C24 = C16*Math.sin(num2jd(res.coneAngle/2))*2+res.thickness*Math.cos(num2jd(res.coneAngle/2));
            let C25 = C11*Math.cos(num2jd(res.coneAngle/2));

            res.height = C9.toFixed(0);
            res.jsDiameter = C23.toFixed(0);
            res.jsHeight = C25.toFixed(0);
            res.jsDownDiameter = C24.toFixed(0);
            res.jsBjd = C18.toFixed(1);
            res.jsBbigR = C17.toFixed(0);
            res.jsBheight1 = C20.toFixed(0);
            res.jsBheight2 = C19.toFixed(0);
            res.jsBlittleR = C16.toFixed(0);
            res.jsBdiameter = C21.toFixed(0);
            res.jsBdownDiameter = C22.toFixed(0);

            return res;
        }

    }else {

        if(nj){
            let C3 = res.diameter;
            let C4 = res.downDiameter;
            let C9 = (C3-C4)/2/Math.sin(num2jd(res.coneAngle/2));
            let C8 = Math.sin(num2jd(res.coneAngle/2))*res.thickness+C9*Math.cos(num2jd(res.coneAngle/2));
            let C11 = 2*res.thickness<=20 ? 20 : (2*res.thickness<=30 ? 2*res.thickness : 30);
            let C12 = C4/2+res.thickness/2*Math.cos(num2jd(res.coneAngle/2));
            let C13 = xpk==0 ? 0 : C11;
            let C10 = C9+C11+C13;
            let C14 = C11;
            let C15 = C12/Math.sin(num2jd(res.coneAngle/2))-C13;
            let C16 = C15+C10;
            let C17 = 360*Math.sin(num2jd(res.coneAngle/2));
            let C18 = C16*(1-Math.cos(num2jd(C17/2)));
            let C19 = C15*(1-Math.cos(num2jd(C17/2)))+C16-C15;
            let C20 = 2*C15*Math.sin(num2jd(C17/2));
            let C21 = 2*(C10+C15)*Math.sin(num2jd(C17/2));
            let C22 = C16*Math.sin(num2jd(res.coneAngle/2))*2-Math.cos(num2jd(res.coneAngle/2))*res.thickness;
            let C23 = C15*Math.sin(num2jd(res.coneAngle/2))*2-res.thickness*Math.cos(num2jd(res.coneAngle/2));
            let C24 = C10*Math.cos(num2jd(res.coneAngle/2));

            res.height = C8.toFixed(0);
            res.jsDiameter = C22.toFixed(0);
            res.jsHeight = C24.toFixed(0);
            res.jsDownDiameter = C23.toFixed(0);
            res.jsBjd = C17.toFixed(1);
            res.jsBbigR = C16.toFixed(0);
            res.jsBheight1 = C19.toFixed(0);
            res.jsBheight2 = C18.toFixed(0);
            res.jsBlittleR = C15.toFixed(0);
            res.jsBdiameter = C20.toFixed(0);
            res.jsBdownDiameter = C21.toFixed(0);

            return res;
        }else {
            let C3 = res.diameter - 2 * res.thickness * Math.cos(num2jd(res.coneAngle / 2));
            let C4 = res.downDiameter - 2 * res.thickness * Math.cos(num2jd(res.coneAngle / 2));
            let C9 = (C3-C4)/2/Math.sin(num2jd(res.coneAngle/2));
            let C8 = Math.sin(num2jd(res.coneAngle/2))*res.thickness+C9*Math.cos(num2jd(res.coneAngle/2));
            let C11 = 2*res.thickness<=20 ? 20 : (2*res.thickness<=30 ? 2*res.thickness : 30);
            let C12 = C4/2-res.thickness/2*Math.cos(num2jd(res.coneAngle/2));
            let C13 = xpk==0 ? 0 : C11;
            let C10 = C9+C11+C13;
            let C14 = C11;
            let C15 = C12/Math.sin(num2jd(res.coneAngle/2))-C13;
            let C16 = C15+C10;
            let C17 = 360*Math.sin(num2jd(res.coneAngle/2));
            let C18 = C16*(1-Math.cos(num2jd(C17/2)));
            let C19 = C15*(1-Math.cos(num2jd(C17/2)))+C16-C15;
            let C20 = 2*C15*Math.sin(num2jd(C17/2));
            let C21 = 2*(C10+C15)*Math.sin(num2jd(C17/2));
            let C22 = C16*Math.sin(num2jd(res.coneAngle/2))*2-Math.cos(num2jd(res.coneAngle/2))*res.thickness;
            let C23 = C15*Math.sin(num2jd(res.coneAngle/2))*2-res.thickness*Math.cos(num2jd(res.coneAngle/2));
            let C24 = C10*Math.cos(num2jd(res.coneAngle/2));

            res.height = C8.toFixed(0);
            res.jsDiameter = C22.toFixed(0);
            res.jsHeight = C24.toFixed(0);
            res.jsDownDiameter = C23.toFixed(0);
            res.jsBjd = C17.toFixed(1);
            res.jsBbigR = C16.toFixed(0);
            res.jsBheight1 = C19.toFixed(0);
            res.jsBheight2 = C18.toFixed(0);
            res.jsBlittleR = C15.toFixed(0);
            res.jsBdiameter = C20.toFixed(0);
            res.jsBdownDiameter = C21.toFixed(0);

            return res;
        }

    }
}

function num2jd(num) {
    return num * Math.PI / 180;
}

