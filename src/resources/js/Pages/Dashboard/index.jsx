import React, { useEffect, useState, useRef } from 'react'
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import axios from 'axios'
import { DownloadOutlined } from '@ant-design/icons'
import { Modal, List,message, Carousel } from 'antd'
import Highcharts from 'highcharts';
import highcharts3d from 'highcharts/highcharts-3d'
import HC_more from 'highcharts/highcharts-more'
import HighchartsReact from 'highcharts-react-official';
import DashboardLayout from '@/Shared/DashboardLayout'
import _, { replace } from 'lodash';
HC_more(Highcharts)
highcharts3d(Highcharts)


const asnlists = [
    {
        name: "TOUS LES ASN",
        value: ""
    },
    {
        name: "ISOCEL SA",
        value: "ISOCEL SA"
    },
    {
        name: "SOCIETE BENINOISE D'INFRASTRUCTURES NUMERIQUES",
        value: "SOCIETE BENINOISE D'INFRASTRUCTURES NUMERIQUES"
    },
    {
        name: "SUD TELECOM SOLUTIONS",
        value: "SUD TELECOM"
    },
    {
        name: "OMNIUM DES TELECOM ET DE L'INTERNET",
        value: "OMNIUM DES TELECOM ET DE L'INTERNET (OTI TELECOM)"
    },
    {
        name: "SPACETEL BENIN SA",
        value: "SPACETEL"
    },
    {
        name: "ETISALAT BENIN",
        value: "ETISALAT BENIN"
    },
    {
        name: "JENY SAS",
        value: "JENY SAS"
    },
    {
        name: "ABC CORPORATION SARL",
        value: "ABC Corporation SARL"
    },
    {
        name: "MASSACHUSETTS INSTITUTE OF TECHNOLOGY",
        value: "MASSACHUSETTS INSTITUTE OF TECHNOLOGY"
    },
    {
        name: "AGENCE POUR LE DEVELOPPEMENT DU NUMERIQUE",
        value: "Agence pour le Developpement"
    },
    
]

const INTERVAL_TIMER = 630000;

const Dashboard = ({errors}) => {
    const [ stats, setStats ] = useState(null)
    const [messageApi, contextHolder] = message.useMessage()
    const [ single_data, setSingleData ] = useState(null)
    const [types, setTypes] = useState([])
    const [open, setOpen] = useState(false);
    const [piechart_data, setPieChartData] = useState([])
    const [category, setCategory] = useState("");
    const [filename, setFilename] = useState('');
    const [selected_asn, setSelectedASN] = useState('')
    const [date, setDate] = useState(new Date().toISOString().split('T')[0])
    const [values, setValues]= useState([])
    const [data, setData]= useState([])
    const date_ref = useRef(null)
    const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const fileExtension = '.xlsx';

    const single_stats = async (category)=>{
        try {
            let type = ['sinkhole', 'honeypot', 'blocklist'].includes(category) ? category : 'scan'
            let infection = ['sinkhole', 'honeypot', 'blocklist'].includes(category) ? null : category
            let payload = {
                fetch_from_db: true,
                date,
                type,
                asn_name:selected_asn,
                infection
            }

            const res = await axios.post('/shadow-server', payload)

            setSingleData(res.data)
            setFilename('reports'+'_'+category)
            setCategory("")
            setTimeout(()=>setOpen(true),1000);

        } catch (error) {
        }
    }

    const exportIntoExcelFormat = ()=>{
        const ws = XLSX.utils.json_to_sheet(single_data);
        const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] };
        const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' 
        });

        const data = new Blob([excelBuffer], {type: fileType});
        FileSaver.saveAs(data, filename + fileExtension);
    }

    const genColumnCHart = () => ({
        chart: {
          type: 'column',
          height: 670,
          options3d: {
            enabled: true,
            alpha: 0,
            beta: -2,
            depth: 50,
            viewDistance: 25,
          }
        },
        title: {
          text: '',
        },
        xAxis: {
            categories: types,
        },
        yAxis: {
          title: {
            text: 'Values',
          },
        },
        colors:['#001529'] ,
        plotOptions: {
            series: {
              minPointLength: 2,
              point: {
                    events: {
                        click: function () {
                            let findIndex = this.category.indexOf('_'),category_data_to_request= this.category;
                            if(findIndex!== -1){
                                category_data_to_request = category_data_to_request.substr(findIndex+1)
                                if(category_data_to_request.includes('_')){
                                    category_data_to_request = (category_data_to_request.split('_')).join('-')
                                }
                            }
                            setCategory(category_data_to_request)
                        }
                    }
                }
            }
        },
        series: [
          {
            data,
            dataLabels: {
                rotation: 0,
                verticalAlign: 'top',
                y: -20,
                align: 'left',
                inside: true,
                enabled: true,
                color: '#001529'
            },
          },
        ],
    });


    const genPieChart = ()=>({
        chart: {
            type: 'pie',
            height: 600,
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            options3d: {
                enabled: true,
                alpha: 45,
                beta: 1
            },
          },
          title: {
            text: 'Blocklist IP Distribution',
            align: 'left'
          },
          tooltip: {
            pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
          },
          accessibility: {
            point: {
              valueSuffix: '%'
            }
          },
          plotOptions: {
            pie: {
              allowPointSelect: true,
              cursor: 'pointer',
              depth: 35,
              dataLabels: {
                enabled: true,
                format: '<b>{point.name}</b>: {point.percentage:.1f} %'
              }
            }
          },
          series: [{
            name: '',
            colorByPoint: true,
            data: piechart_data
          }]
    })

    const get_types = async ()=>{
        const type_res = await axios.get('/personalisation/all-types');
        setTypes(type_res.data.map(el=>el.category !=='scan' ? el.type : 'scan_'+el.type.replace(/-/g,'_')))
    }

    const getDataByDateAndASN = async ()=>{
        try {
            const { data } = await axios.post('/shadow-server-records/', {
                asn_name: selected_asn,
                date
            })
            
            let values = []

            console.log({types})
            
            types.map((el)=>{
               values = [...values, !data[el]!=undefined && !data[el].length? null : data[el].length]
            })

            setValues(values)
            
        } catch (error) {
        }
    }

    const getStatsByDate = async()=>{


        try {
            const { data } = await axios.post('/stats/shadow-server-records',{ date, asn_name: selected_asn })
            setStats(data)
        } catch (error) {
        }
    }

    const getStatsByDatAndType = async()=>{
        try {
            const { data } = await axios.post('/stats/shadow-server-records',{ date, type: 'blocklist' })
            
            const total = Object.values(data).reduce((acc, current)=>{
                return acc + current.count
            },0)

            setPieChartData(()=> asnlists.slice(0,-1).map((el)=> {
                if(data[el.name]){
                    return {
                        name: el.name,
                        y: ( data[el.name].count * 100 ) / total
                    }
                }
            }).filter(el=>el!==undefined))

        } catch (error) {
        }
    }

    const get_last_records_date = async ()=>{
        try {
            const {data} = await axios.get('/last-records-date')
            console.log({data})
            setDate(data)
            date_ref.current.value = data
        } catch (error) {
            
        }
    }

    const handleChange = (e)=>{
        setSelectedASN(e.target.value)
    }

    useEffect(()=> setData(values), [values])

    useEffect(()=> { get_last_records_date() }, [])

    useEffect(()=> {
        if(category){
            single_stats(category)
        }
    }, [category])

    useEffect(()=> {
        if(types.length){
            getStatsByDate()
            getDataByDateAndASN()
            getStatsByDatAndType()
        }
    }, [selected_asn, date, types])


    useEffect(()=>{

        get_types()

        const id = setInterval(()=>{ get_last_records_date(); get_types(); }, INTERVAL_TIMER)
        
        return ()=> clearInterval(id)
    }, [])



    useEffect(()=>{
        if(errors && errors.authorization){
            messageApi.open({
                type: 'error',
                content: errors.authorization
            })
        }
    },[errors])



    return (
        <DashboardLayout>
            {contextHolder}
            <Modal
                title={
                    <>
                        <div className='flex space-x-8 pr-8'>
                            <div>Infos</div>
                            <button onClick={exportIntoExcelFormat} className='flex mt-[0.3rem]'><DownloadOutlined /></button>
                        </div>
                    </>
                }
                centered
                open={open}
                onCancel={() => setOpen(false)}
                footer={null}
                cancelButtonProps={{ style: { display: 'none' } }}
            >
                <List
                    itemLayout="vertical"
                    size="large"
                    pagination={{
                    onChange: (page) => {
                        console.log(page);
                    },
                    pageSize: 8,
                    }}
                    dataSource={single_data}
                    renderItem={(item) => (
                        <List.Item
                            key={item.ip}
                        >
                            <span>{item.ip}</span>
                            {" "}
                            {
                                item.source && (<span className='text-red-400'>{item.source}</span>) 
                            }
                        </List.Item>
                    )}
                />
            </Modal>
            <div className='p-2'>
                <div className='flex justify-end'>
                    <select onChange={handleChange}  className='p-2 mb-2 '>
                        {
                            asnlists.map((el, i)=>(
                                <option value={el.value} key={i}>{el.name}</option>
                            ))
                        }
                    </select>
                    <input type="date" ref={date_ref} defaultValue={date} onChange={e=>setDate(e.target.value)} className="bg-gray-200/[.8] h-[2.4rem] ml-2" />
                </div>
                <div className='grid md:grid-cols-4 h-[6rem] gap-x-4'>
                    <div className='bg-white flex justify-center items-center'>
                        <div>
                            <h1 className='text-xl'>Blocklist</h1>
                            <div className='text-center'>
                                {
                                    stats && stats.blocklist ? stats.blocklist.count : 0
                                }
                            </div>
                        </div>
                    </div>

                    <div className='bg-[green] text-white flex justify-center items-center'>
                        <div>
                            <h1 className='text-xl'>Scan</h1>
                            <div className='text-center'>
                            {
                                    stats && stats.scan && stats.scan.count ? stats.scan.count: 0
                                }
                            </div>
                        </div>
                    </div>
                    
                    <div className='bg-[red] text-white flex justify-center items-center'>
                        <div>
                            <h1 className='text-xl'>Sinkhole</h1>
                            <div className='text-center'>
                            {
                                    stats && stats.sinkhole ? stats.sinkhole.count : 0
                                }
                            </div>
                        </div>
                    </div>
                    
                    <div className='bg-[#002140] text-white flex justify-center items-center'>
                        <div>
                            <h1 className='text-xl'>Honeypot</h1>
                            <div className='text-center'>
                            {
                                    stats && stats.honeypot && stats.honeypot.count ? stats.honeypot.count : 0
                                }
                            </div>
                        </div>
                    </div>
                </div>

                <div className='my-4 w-full'>
                    {
                        types.length !=0 ? (
                            <>
                                <Carousel dots={false} autoplaySpeed={30000} autoplay>
                                    <HighchartsReact highcharts={Highcharts} options={genColumnCHart()} />
                                    <div className='my-4 w-full'>
                                        <HighchartsReact highcharts={Highcharts} options={genPieChart()} />
                                    </div>
                                </Carousel>
                            </>
                        ): ''
                    }
                </div>

                

            </div>
        </DashboardLayout>
    )
}

export default Dashboard
