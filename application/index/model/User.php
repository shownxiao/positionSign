<?php
/**
 * Created by PhpStorm.
 * User: 肖婴然
 * Date: 2018/8/3
 * Time: 16:16
 */

namespace app\index\model;


use think\Exception;
use think\Request;
use think\Model;
use think\db;

class User extends Model
{
    public function submitInfo($data)
    {
        $out['status'] = false;
        $info = [
            'openid' => $data['data']['openid'],
            'stuName' => $data['data']['stuName'],
            'stuId' => $data['data']['stuId'],
            'stuTel' => $data['data']['stuTel'],
            'stuSex' => $data['data']['stuSex'],
            'stuCollege' => $data['data']['stuCollege'],
            'stuClass' => $data['data']['stuClass']
        ];
        $rank = [
            'sign_grade' => '0',
            'openid' => $data['data']['openid'],
            'completed_num' => '0',
            'username' => $data['data']['username'],
            'face' => $data['data']['face']
        ];
        if ($this->table('user_info')->where(['openid' => $data['data']['openid']])->select()) {
            $out['status'] = 'updata';
            $this->table('user_info')->where(['openid' => $data['data']['openid']])->update($info);
        } else {
            $this->table('user_info')->insert($info);
            $thisId = $this->table('user_info')->where(['openid'=>$data['data']['openid']])->field('id')->select();

            $rank['allrank']=$thisId[0]['id'];
            $this->table('user_rank')->insert($rank);
            $out['status'] = 'insert';
        }
        return json_encode($out);
    }

    public function deleteInfor($openid)
    {
        $this->table('user_info')->where(['openid' => $openid])->delete(1);
        $out['status'] = true;
        return json_encode($out);
    }


    public function submitProblem($data)
    {
        $data['status'] = db::table('problem')->insert([
            'openid' => $data['openid'],
            'phone' => $data['phone'],
            'caption' => $data['caption'],
            'content' => $data['content'],
            'createtime' => date('Y-m-d H:i;s', time()),
            'is_deal' => 0
        ]);
        return $data;
    }

    public function getInfo($openid)
    {
        if ($res = $this->table('user_info')->where(['openid' => $openid])->select()) {
            $data['status'] = true;
            $data['msg'] = 'hasBind';
            $data['data'] = $res[0];
            $num = $this->table('user_rank')->where(['openid' => $openid])->field('completed_num')->select();
            $data['data']['completed_location_num'] = $num[0]['completed_num'];
        } else {
            $data['status'] = false;
            $data['status'] = 'noBind';
        }

        return $data;
    }

    public function getPositionInfo($data)
    {
        $out['status'] = false;
        $info = [
            'openid' => $data['openid'],
            'position_name' => $data['position'],
        ];
        $pos = $this->table('position_info')->where(['position_name' => $info['position_name']])->select();
        $out['position'] = $data['position'];
        $out['introduction'] = $pos[0]['position_intro'];
        $out['longitude'] = $pos[0]['position_longitude'];
        $out['latitude'] = $pos[0]['position_latitude'];
        $out['radius'] = $pos[0]['position_radius'];
        if ($res = $this->table('sign_status')->where(['openid' => $info['openid']])->where(['position_name' => $info['position_name']])->select()) {
            $out['order'] = $res[0]['rank'];
            $out['score'] = $res[0]['gain'];
            $out['msg'] = true;
        } else {
            $out['msg'] = false;
        }
        $out['status'] = true;
        return $out;
    }

    public function getRankInfo($data)
    {
        $out['status'] = false;
        $rankhign = $data['page']*50;
        $ranklow = ($data['page']-1)+1;
        $rankAll = db::table('user_rank')->where("allrank >= ($ranklow")->where("allrank >= ($rankhign)")->order('allrank asc')->select();
        $out['data'] = $rankAll;
        if($res = db::table('user_info')->where(['openid' => $data['openid']])->select()){
            $out['msg'] = 'hasBind';
            for ($count = 0; $count < sizeof($rankAll); $count++) {
                if ($rankAll[$count]['openid'] == $data['openid']) {
                    $out['status'] = true;
                    $out['user_rankInfo']['rank'] = $rankAll[$count]['allrank'];
                    $out['user_rankInfo']['face'] = $rankAll[$count]['face'];
                    $out['user_rankInfo']['username'] = $rankAll[$count]['username'];
                    $out['user_rankInfo']['sign_grade'] = $rankAll[$count]['sign_grade'];
                }
            }
        }else {
            $out['msg'] = 'noBind';
        }
        return $out;
    }

    public function getAllPosition($openid)
    {
        $out['status'] = false;
        $res = db::table('position_info')->select();
        /*$position = [
            'id' => $res['id'],
            'position' => $res['position_name'],
            'introduction' => $res['position_intro'],
            'midLongitude' => $res['position_longitude'],
            'midLatitude' => $res['position_latitude'],
            'radius' => $res['position_radius']
        ];*/
        $out['position_data'] = $res;
        if($bind = db::table('user_info')->where(['openid' => $openid])->select()){
            $out['msg'] = 'hasBind';
            $out['status'] = true;
            $hasSign = db::table('sign_status')->where(['openid' => $openid])->field('position_name, rank, gain')->select();
            for($i=0;$i<sizeof($res);$i++){
                $out['position_data'][$i]['status'] = false;
                for($j=0;$j<sizeof($hasSign);$j++){
                    if($res[$i]['position_name']==$hasSign[$j]['position_name']){
                        $out['position_data'][$i]['status'] = true;
                        $out['position_data'][$i]['order'] = $hasSign[$j]['rank'];
                        $out['position_data'][$i]['score'] = $hasSign[$j]['gain'];
                    }
                }
            }
        }else {
            $out['msg'] = 'noBind';
            $out['status'] = true;
        }
        return $out;
    }

    public function successSign($data)
    {
        $out['status'] = false;
        if($bind = db::table('user_info')->where(['openid' => $data['openid']])->select()){
            $out['msg'] = 'hasBind';
            $out['status'] = true;
            if($res = db::table('sign_status')->where(['openid'=>$data['openid']])->where(['position_name'=>$data['position']])->select())
            {
                $out['msg'] = 'haveSign';
            }
            else{
                $position_number = db::table('position_info')->where(['position_name' => $data['position']])->field('position_number')->select();
                $position_grade = db::table('position_info')->where(['position_name' => $data['position']])->field('position_grade')->select();
                $queue['position_number'] = $position_number;
                $queue['position_grade'] = $position_grade;
                $interval = floor($queue['position_number'][0]['position_number']/50 + 1);
                $thisScoreModel = $queue['position_grade'][0]['position_grade'] + $queue['position_grade'][0]['position_grade']/(10 * $interval);
                $thisScore = round($thisScoreModel, 2);
                $thisQueue = $queue['position_number'][0]['position_number'] + 1;
                $selfRank = db::table('user_rank')->where(['openid' => $data['openid']])->select();
                $thisAllScore = $selfRank[0]['sign_grade'] + $thisScore;
                $findOld = db::table('user_rank')->where(['openid' => $data['openid']])->field('allrank')->select();
                $oldRank = $findOld[0]['allrank'];
                $res = db::table('user_rank')->where("sign_grade >= ($thisAllScore)")->count();
                $newRank = $res + 1;
                for ($i = $oldRank - 1;$i >= $newRank; $i--){
                    $perRank = $i + 1;
                    db::table('user_rank')->where(['allrank' => $i])->update(['allrank' => $perRank]);
                }
                $info = [
                    'openid' => $data['openid'],
                    'position_name' => $data['position'],
                    'rank' => $thisQueue,
                    'gain' => $thisScore,
                    'signtime' => date('Y-m-d H:i;s', time()),
                ];
                $self = [
                    'allrank' => $newRank,
                    'openid' => $data['openid'],
                    'sign_grade' => $thisAllScore,
                    'completed_num' => $selfRank[0]['completed_num'] + 1,
                    'username' => $selfRank[0]['username'],
                    'face' => $selfRank[0]['face'],
                ];
                db::table('sign_status')->insert($info);
                db::table('user_rank')->where(['openid'=>$data['openid']])->update($self);
                db::table('position_info')->where(['position_name'=>$data['position']])->update(['position_number'=>$thisQueue]);
            }
        }else {
            $out['msg'] = 'noBind';
            $out['status'] = true;
        }
        return $out;
    }
}