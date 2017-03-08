## (C#)滑块验证码
![image](https://raw.githubusercontent.com/eatage/VerificationCode/master/demo.png)

### VerificationCode简介

> 用户拖动滑块完成时完成校验，支持PC端及移动端。并在后台保存用户校验过程的时间、精度、滑动轨迹等信息。
> 输出的验证码为JSON格式，其中大图片是将原图裁剪成横向10份纵向2分共20张图片随机混淆拼接而成的，原图通过在前端移位还原，混淆信息带在JSON上
> **JSON格式说明：**
>&nbsp;&nbsp;&nbsp;&nbsp;*errcode：状态码*
> &nbsp;&nbsp;&nbsp;&nbsp;*y：裁剪的小图相对左上角的y轴坐标*
>&nbsp;&nbsp;&nbsp;&nbsp;*array：验证码图片混淆规律*
>&nbsp;&nbsp;&nbsp;&nbsp;*imgx：验证码图片宽度*
>&nbsp;&nbsp;&nbsp;&nbsp;*imgy：验证码图片高度*
>&nbsp;&nbsp;&nbsp;&nbsp;*small：裁剪的小图片*
>&nbsp;&nbsp;&nbsp;&nbsp;*imgy：验证码混淆后的图片*
>**兼容信息：**兼容主流浏览器，IPhone端的Safari、QQ内置浏览器、微信内置浏览器测试通过，Android端未测试
#### JSON格式示例
```  json
{
  "errcode": 0,
  "y": 189,
  "array": "0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19",
  "imgx": 300,
  "imgy": 300,
  "small": "data:image/jpg;base64,/...",
  "normal":"data:image/jpg;base64,/..."
}
```

#### 演示地址：[demo](http://120.76.164.184/vcode/demo.htm)
