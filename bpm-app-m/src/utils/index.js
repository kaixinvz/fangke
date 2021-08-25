// import html2canvas from 'html2canvas' 
import moment from 'moment'
import { Toast } from 'mint-ui';
const exportPDF=(element,title)=>{
    html2canvas(document.querySelector(element)).then(canvas => {  
		var pageData = canvas.toDataURL('image/jpeg', 1.0); 
        const bitmap = new plus.nativeObj.Bitmap();
        title=title+'  '+moment().format('YYYY-MM-DD'); 
        const imgTitle = `_doc/${title}.jpeg`
        bitmap.loadBase64Data(pageData.substr(22), function () {
        //    console.log('加载图片成功');
        bitmap.save(imgTitle, {
            overwrite: true,
            quality: 30
        }, function (i) {
            plus.gallery.save(imgTitle, function () { 
            Toast('保存成功');
            bitmap.clear();
            }, function () { 
                Toast('保存失败，请重试！');
            });

        }, function (e) { 
            Toast('保存图片失败');
          
        });
        }, function (e) { 
            Toast('加载图片失败');
        });
	});
}

/* 
 * setRollingHeight 解决:不同手机分辨率高度不一样,带有下拉刷新的元素,设置固定高度部分手机会出现底部留白  
 *@method setRollingHeight 
 *@param { element } element 下拉元素  更改高度 自动适应 不同手机端 
 *@return  null  
*/

const setRollingHeight=(element)=>{
    const mainOffsetTop=element.offsetTop;
    const height=document.documentElement.clientHeight-mainOffsetTop+'px'; 
     element.style.height=height;
}

export {
    exportPDF,
    setRollingHeight
}