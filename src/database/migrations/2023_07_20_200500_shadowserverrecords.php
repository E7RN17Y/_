<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('shadowserverrecords', function (Blueprint $table) {
            $table->id();
            $table->string('type');
            $table->string('city');
            $table->string('region')->nullable();
            $table->string('asn_name');
            $table->string('isp_name');
            $table->string('ip')->nullable();
            $table->string('device_type')->nullable();
            $table->string('tag')->nullable();
            $table->string('severity')->nullable();
            $table->string('source')->nullable();
            $table->string('device_sector')->nullable();
            $table->string('sector')->nullable();
            $table->string('infection');
            $table->string('date');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        //
    }
};
