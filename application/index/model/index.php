<?php
/**
 * Created by PhpStorm.
 * User: 肖婴然
 * Date: 2018/8/3
 * Time: 12:43
 */

namespace app\index\controller;

use think\Controller;
use think\Request;
use think\Config;

class Index extends Controller
{

    protected $config = [
        'AppID' => 'wx73d5034bff091768',
        'AppSecret' => '2b66c3c57b22818d46131e285be47b40',
    ];
    public function __construct(Request $request = null)
    {
        parent::__construct($request);
        $this->config = Config::get('wxapp');
        $referer = $request->header('referer');
        $patternStr = '((?<=(https://servicewechat.com/' . $this->config['AppID'] . '))[\w\W]*?(?=(/page-frame.html)))';
        if (preg_match($patternStr, $referer, $version) == 0) {
            exit('非法访问');
        } else {
            $version = $version[0];
        }
    }

    public function index()
    {
        return "Hello,freshmen!";
    }
    public function login(Request $request){
        $appid = 'wx73d5034bff091768';
        $secret = '6e762517283b9bad573bdc5771498184';
        $code = $request->get('code');
        $url = "https://api.weixin.qq.com/sns/jscode2session?appid=".$appid."&secret=".$secret."&js_code=".$code."&grant_type=authorization_code";
        $res = json_decode(file_get_contents($url), true);
        if (isset($res['errcode'])) {
            $data['errmsg'] = $res['errmsg'];
            $data['status'] = false;
        } else {
            $data['status'] = true;
            $data['openid'] = $res['openid'];
        }
        return json_encode($data);
    }


}
