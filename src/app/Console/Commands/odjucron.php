<?php

namespace App\Console\Commands;

use App\Services\ShadowServerApiService;

use Illuminate\Console\Command;

use Illuminate\Support\Carbon;

use App\Models\Shadowserverrecord;

class odjucron extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'launch:odju';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'His purpose is to launch odju cron Job';

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle(ShadowServerApiService $shadowserverapiservice):void
    {
        $types = ["blocklist", "scan", "sinkhole", "honeypot"];

        $data=[];

        $now = Carbon::now('utc')->toDateString();

        foreach($types as $type){

            $payload= json_encode(
                array(
                   "query"=> [
                        "geo" => "BJ",
                        "type" => $type,
                        "date" => $now   
                    ]
                ),JSON_PRETTY_PRINT);

            $responses = $shadowserverapiservice->callApi('reports/query',$payload);


            if(count($responses) > 0){

                foreach($responses as $response){
                    $data[]= array(
                                   'type'=>$response['type'], 'city'=>$response['city'], 'region'=>$response['region'],'source'=>!empty($response['source']) ? $response['source']: null,
                                   'severity'=>!empty($response['severity']) ? $response['severity']:null, 'date'=>$response['timestamp'],'isp_name'=>$response['isp_name'],'ip'=>!empty($response['ip']) ? $response['ip']: null,
                                   'infection'=>$response['infection'], 'asn_name'=>$response['asn_name'], 'device_type'=>!empty($response['device_type']) ? $response['device_type']: null,
                                   'tag'=>!empty($response['tag']) ? implode(',',$response['tag']) : null, 'device_sector'=>!empty($response['device_sector']) ?$response['device_sector']: null,
                                   'sector'=>!empty($response['sector']) ? $response['sector'] : null
                                );

                }
            }
        }

        foreach($data as $record){
            Shadowserverrecord::updateOrCreate($record,$record);
        }

        info('log');
        


    }
}
