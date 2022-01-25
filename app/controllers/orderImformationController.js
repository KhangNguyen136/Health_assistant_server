const db = require("../models");
const Thong_tin_y_te_khac = db.orderimfomation;
const public_func = require("../share/public_func");
const axios = require('axios');
const history = require("../controllers/historychatController");


const link = "http://7be1-2402-800-63a9-bb85-1198-15bf-20db-f2a2.ngrok.io"

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
                .find({$text: {$search:  name }},{ score: { $meta: "textScore" } })
                .sort({ score: { $meta: "textScore" } });
            
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

                    if(count%50 == 0)
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
                        break;
                    }
                    count ++;

                }
                output =  await Thong_tin_y_te_khac.findOne({"tieu_de": content});
                if(out>0.59)
                {
                    res.status(200).json({
                        "data" : output,
                        "percent": out,
                        "message": "Successfull"
                    });
                }
                else
                {
                    res.status(200).json({
                        "data" : [],
                        "message": "Successfull"
                    });
                }
            }
            else
            {
                res.status(200).json({
                    "data" : [],
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

exports.searchbyNameDialog = async(req, res) => {
    try {
        var name = req.query.name;
        url_api = encodeURI(link + `/stopword?content=${name}`) ;
        await axios.get(url_api).then(function(response){name = response.data["content"];});
        var data;
        if (name) {
            data = await Thong_tin_y_te_khac.find({$text: {$search: name}});
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

                    if(count%50 == 0)
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
                        break;
                    }
                    count ++;

                }
                
                output =  await Thong_tin_y_te_khac.find({"tieu_de": content});

                if(out>0.7)
                {
                    return output;
                }
                else
                {
                    return null;
                }
            }
            else
            {
                return null;
            }
        }
        else
        {
            return null;
        }

    } catch (error) {
        return null;
    }

};