<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Shadowserverrecord extends Model
{
    use HasFactory;

    protected $fillable = ['type','city','region','severity','date','sector','infection','tag','isp_name','source','asn_name','device_type','device_sector', 'ip'];
}
