import { Component } from '@angular/core';
import { NavController, LoadingController, ModalController } from 'ionic-angular';
import { DraftData, ReviewPostData } from '../../model/TravelNotesData'
import { UserInfoService } from '../../providers/UserInfoService';
import { LoginPage } from '../login/login'
import { draftListReq, deleteDraftReq, reviewPostListReq } from '../../req/index'
import { PostPage } from '../post/post';

@Component({
  templateUrl: 'drafts.html'
})
export class DraftsPage {
    constructor(
        public navCtrl: NavController,
        private userInfoService: UserInfoService,
        public modalCtrl: ModalController,
        public loadingCtrl: LoadingController
    ) {
        this.loader = this.loadingCtrl.create({
            content: "Loading...",
        });
        this.init()
    }
    loader: any
    listDrafts: DraftData[]
    listReviewPosts: ReviewPostData[]
    init(){
		if(!this.refresh()){
			let loginModal = this.modalCtrl.create(LoginPage);
			loginModal.onDidDismiss(data => {
				// console.log()
				this.refresh()
			});
			loginModal.present()
		}
	}
	refresh(): boolean{
        this.loader.present()
		console.log("Drafts: Refresh!")
		let userInfo = this.userInfoService.getUserInfo()
		if(userInfo == null){
			console.log("Drafts: userInfo is null.")
			return false
		}
		console.log("Drafts: get userInfo -> " + userInfo.toJsonStr())
        this.getDrafts(userInfo.name)
        this.getReviewPosts(userInfo.name)
		return true
    }
    getDrafts(author: string){
        let datas = []
        draftListReq().then((success) => {
            console.log("draftListReq: " + success['Draftpost'])
            for(let i in success['Draftpost']){
                if(success['Draftpost'][i].author == author){
                    let data = new DraftData(success['Draftpost'][i].id, success['Draftpost'][i].title, 
                                                success['Draftpost'][i].content,success['Draftpost'][i].author, 
                                                success['Draftpost'][i].username,success['Draftpost'][i].location, 
                                                0, success['Draftpost'][i].tags)
                    datas.push(data)
                }
            }
            this.listDrafts = datas
            this.loader.dismiss()
        }, (error) => {
            console.debug("draftListReq:" + error);
        });
    }
    getReviewPosts(author: string){
        let datas = []
        reviewPostListReq().then((success) => {
            console.log("reviewPostListReq: " + success['Reviewpost'])
            for(let i in success['Reviewpost']){
                if(success['Reviewpost'][i].author == author){
                    let data = new ReviewPostData(success['Reviewpost'][i].id, success['Reviewpost'][i].title, 
                                                success['Reviewpost'][i].content,success['Reviewpost'][i].author, 
                                                "",success['Reviewpost'][i].location, 
                                                0, success['Reviewpost'][i].tags,
                                                success['Reviewpost'][i].count, success['Reviewpost'][i].status,
                                                success['Reviewpost'][i].reviewnum)
                    datas.push(data)
                }
            }
            this.listReviewPosts = datas
        }, (error) => {
            console.debug("reviewPostListReq:" + error);
        });
    }
    deleteDraft(draft: DraftData){
        deleteDraftReq(draft.id).then((success) => {
            this.loader.present();
            console.log("deleteDraftReq: " + success)
            for(let i = 0; i < this.listDrafts.length; i++){
                if(draft.id == this.listDrafts[i].id){
                    this.listDrafts.splice(i, 1)
                }
            }
            this.loader.dismiss()
        }, (error) => {
            console.debug("deleteDraftReq:" + error);
        });
    }
    createDraft(){
        this.navCtrl.push(PostPage)
    }
    updateDraft(draftData: DraftData){
        this.navCtrl.push(PostPage, {'draftData': draftData})
    }
    pushReviewDraft(reviewPost: ReviewPostData){

    }
}