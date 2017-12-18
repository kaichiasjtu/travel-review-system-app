import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { FormBuilder, Validators } from '@angular/forms'
import { TravelNotesService } from '../../providers/TravelNotesService'
import { UserInfoService } from '../../providers/UserInfoService';
import { UserInfoData } from '../../model/UserInfoData';
import { DraftData } from '../../model/TravelNotesData';
import { addDraftPostReq, updateDraftPostReq } from '../../req/index'
import { LoadingController } from 'ionic-angular/components/loading/loading-controller';
import { DraftsPage } from '../drafts/drafts';
import { NavParams } from 'ionic-angular/navigation/nav-params';
import { FormGroup } from '@angular/forms/src/model';

@Component({
	selector: 'page-post',
	templateUrl: 'post.html'
})
export class PostPage {

	constructor(
        public navCtrl: NavController,
        private formBuilder: FormBuilder,
        public travelNotesService: TravelNotesService,
        public userInfoService: UserInfoService,
        public loadingCtrl: LoadingController,
        public navParams: NavParams,
	) {
        
        this.locations = this.travelNotesService.getLocation()
        this.userInfo = this.userInfoService.getUserInfo()
        this.draftData = this.navParams.get('draftData')
        if(this.draftData != undefined){
            this.PostForm = this.formBuilder.group({
                'title': [this.draftData.title, [Validators.required,]],
                'content': [this.draftData.content, [Validators.required,]],
                'location': [this.draftData.location, [Validators.required,]],
            });
        }       
    }
    draftData: DraftData
    date: Date
    userInfo: UserInfoData
    locations = []
    PostForm = this.formBuilder.group({
        'title': ['纽约两日游', [Validators.required,]],
        'content': ['纽约市（City of New York，简称NYC），位于美国纽约州东南部大西洋沿岸，是美国第一大城市及第一大港。\
                    纽约坐拥大纽约都会区的核心地带，是一座世界级国际化大都市，也是世界第一大经济中心，其GDP于2013年超越东京，位居世界第\
                    一。截至2010年，纽约的财产所有总值为813万亿美元，直接影响着全球的金融、媒体、政治、娱乐以及时尚界。', [Validators.required,]],
        'location': ['纽约', [Validators.required,]],
    });
    post(){

    }
    add(draftData: DraftData){
        let loader = this.loadingCtrl.create({
			content: "Loading...",
		});
        loader.present();
        addDraftPostReq(draftData).then((success) => {
			/* eslint no-console: ["error", { allow: ["debug"] }] */
            console.log("addDraftPostReq: success! -> " + draftData.title)
            loader.dismiss()
			this.navCtrl.push(DraftsPage)
		}, (error) => {
			/* eslint no-console: ["error", { allow: ["debug"] }] */
            console.debug("addDraftPostReq:" + error);
            loader.dismiss()
		});
    }
    update(draftData: DraftData){
        let loader = this.loadingCtrl.create({
            content: "Loading...",
        });
        loader.present();
        draftData.id = this.draftData.id
        updateDraftPostReq(draftData).then((success) => {
            /* eslint no-console: ["error", { allow: ["debug"] }] */
            console.log("updateDraftPostReq: success! -> " + draftData.title)
            loader.dismiss()
            this.navCtrl.push(DraftsPage)
        }, (error) => {
            /* eslint no-console: ["error", { allow: ["debug"] }] */
            console.debug("updateDraftPostReq:" + error);
            loader.dismiss()
        });
    }
    save(){
        this.date = new Date()
        let draftData = new DraftData(  0, 
                                        this.PostForm.value.title, 
                                        this.PostForm.value.content, 
                                        this.userInfo.name, 
                                        this.userInfo.username,
                                        this.PostForm.value.location,
                                        this.date.getTime())
        if(this.navParams.get('draftData') == undefined){
            this.add(draftData)
        }
        else{
            this.update(draftData)
        }
    }
}
