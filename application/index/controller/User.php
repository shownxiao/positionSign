<?php
/**
 * Created by PhpStorm.
 * User: 肖婴然
 * Date: 2018/8/3
 * Time: 16:29
 */

namespace app\index\controller;


use think\Controller;
use app\index\model\User as UserModel;
use think\Request;
use think\config;
class User extends Controller
{
    protected $config=[
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

    /*
     * 绑定信息
     */
    public function submitInfo(Request $request){
        $user = new UserModel();
        $data = $request->post();
        return $user->submitInfo($data);

    }

    /*
     * 删除信息
     */
    public function deleteInfor(Request $request){
        $user = new UserModel();
        $data = $request->post('openid');
        return $user->deleteInfor($data);
    }

    /*
     * 问题提交
     */
    public function submitProblem(Request $request){
        $user = new UserModel();
        $data = $request->post();
        return json_encode($user->submitProblem($data));
    }

    /*
     * 获取个人信息
     */
    public function getInfo(Request $request){
        $user = new UserModel();
        $openid = $request->post('openid');
        return json_encode($user->getInfo($openid));
    }

    /*
     * 获取地点信息
     */
    public function getPositionInfo(Request $request){
        $user = new UserModel();
        $data = $request->post();
        return json_encode($user->getPositionInfo($data));
    }

    /*
     * 获得排名信息
     */
    public function getRankInfo(Request $request){
        $user = new UserModel();
        $data = $request->post();
        return json_encode($user->getRankInfo($data));
    }

    /*
     * 获取所有地点及其打卡情况
     */
    public function getAllPosition(Request $request){
        $user = new UserModel();
        $openid = $request->post('openid');
        return json_encode($user->getAllPosition($openid));
    }

    /*
     * 成功打卡
     */
    public function successSign(Request $request){
        $user = new UserModel();
        $data = $request->post();
        return json_encode($user->successSign($data));
    }

















    /*
     * 提交报名信息
     */
    public function submitSign(Request $request){
        $user = new UserModel();
        $data = $request->post();
        return json_encode($user->submitSign($data));
    }


    /*
     * 获取报名信息
     */
    public function getSign(Request $request){
        $user = new UserModel();
        $openid = $request->post('openid');
        return ($user->getSign($openid));
    }




    /*
     * 更新个人信息
     */
    public  function updateInfo(Request $request){
        $user = new UserModel();
        $data = $request->post();
        return json_encode($user->updateInfo($data));
    }
}