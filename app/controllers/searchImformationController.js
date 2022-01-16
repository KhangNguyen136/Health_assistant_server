const db = require("../models");
const Thong_tin_y_te_khac = db.Thong_tin_y_te_khac;
const public_func = require("../share/public_func");
let request = require('request');
const axios = require('axios');

const link = "http://55ed-8-21-11-211.ngrok.io"
  
exports.searchbyName = async(req, res) => {
    
    try {
        var name = req.query.name;

        url_api = encodeURI(link + `/stopword?content=${name}`) ;
        await axios.get(url_api).then(function(response)
        {
            name = response.data["content"];
            
        });
        var data;
        if (name) {
            data = await Thong_tin_y_te_khac
                .find({$text: {$search: name}});
            
            if(data.length >0)
            {
                var noidung2 = "";
                var count = 1;
                var content;
                var out = 0;
                for(var i = 0; i<data.length; i++)
                {
                    if(count == 1)
                    {
                        noidung2 = data[i]["tieu_de"]
                    }
                    else
                    {
                        noidung2 += " , " + data[i]["tieu_de"]
                    }

                    if(count%70 == 0)
                    {
                        url_api = encodeURI(link + `/sosanh?noidung1=${name}&noidung2=${noidung2}`) ;
                        await axios.get(url_api).then(function(response)
                        {
                            if(out<response.data["phan_tram"])
                            {
                                content =  response.data["content"]
                                out = response.data["phan_tram"]
                            }
                            
                        });
                        noidung2 = "";
                    }
                    count ++;

                }
                if(count%70 > 0)
                {
                    url_api = encodeURI(link + `/sosanh?noidung1=${name}&noidung2=${noidung2}`) ;
                    await axios.get(url_api).then(function(response)
                    {
                        if(out<response.data["phan_tram"])
                        {
                            content =  response.data["content"]
                            out = response.data["phan_tram"]
                        }
                        
                    });
                    noidung2 = "";
                }
                
                res.status(200).json({
                    "data" : content,
                    "percent": out,
                    "message": "Successfull"
                });
            }
            else
            {
                res.status(200).json({
                    "data" : [],
                    "value": name,
                    "message": "Successfull"
                });
            }
        }
        else
        {
            res.status(400).json({ "message": "Bad Request" });
        }

    } catch (error) {
        res.status(500).json({ "message": "Server Error" });
        console.log(error);
    }

};