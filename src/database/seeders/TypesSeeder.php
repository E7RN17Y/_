<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class TypesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        //
        \App\Models\Type::insert([
            [
             'type'=> 'blocklist',
             'category'=> 'not-scan'
            ],
            [
             'type'=> 'sinkhole',
             'category'=> 'not-scan'
            ],
            [
             'type'=> 'honeypot',
             'category'=> 'not-scan'
            ],
            [
             'type'=> 'cisco-smart-install',
             'category'=> 'scan'
            ],
            [
             'type'=> 'dns',
             'category'=> 'scan'
            ],
            [
             'type'=> 'http',
             'category'=> 'scan'
            ],
            [
             'type'=> 'ftp',
             'category'=> 'scan'
            ],
            [
             'type'=> 'netbios',
             'category'=> 'scan'
            ],
            [
             'type'=> 'fortinet',
             'category'=> 'scan'
            ],
            [
             'type'=> 'ssh',
             'category'=> 'scan'
            ],
            [
             'type'=> 'smtp',
             'category'=> 'scan'
            ],
            [
             'type'=> 'ssl',
             'category'=> 'scan'
            ],
            [
             'type'=> 'snmp',
             'category'=> 'scan'
            ],
            [
             'type'=> 'tftp',
             'category'=> 'scan'
            ],
            [
             'type'=> 'telnet',
             'category'=> 'scan'
            ],
            [
             'type'=> 'amqp',
             'category'=> 'scan'
            ],
            [
             'type'=> 'ssdp',
             'category'=> 'scan'
            ],
            [
             'type'=> 'exchange',
             'category'=> 'scan'
            ],
            [
             'type'=> 'mysql',
             'category'=> 'scan'
            ],
            [
             'type'=> 'smb',
             'category'=> 'scan'
            ],
            [
             'type'=> 'mssql',
             'category'=> 'scan'
            ]
         ]);
    }
}
