import React, { Children } from 'react';
import ReactDOM from 'react-dom';
import SEARCHER, { ISearcherProp, TSearcherLang, TOnSearch, TFilterCounts, TNavBar, TFilterOption, TNightViewOp } from './Searcher';
import "./scss/App.scss";

//빌드랑 
// Js 빌드는 완전히 다른거아님?
// 따로 한번씩 해주면 될ㄷ스 


// Idea
// 만약에 string 으로 html 받고 넣어줄수 있다면 ? 
// 하지만 지금 하진 않을것임


interface SEARCHER_INIT_OPTION extends ISearcherProp {
}

// 이코드 리뷰점 부탁해보자
class JD_SEARCH implements SEARCHER_INIT_OPTION {
	lang: TSearcherLang;
	onSearch: TOnSearch;
	dateFormat?: string;
	navBar?: TNavBar;
	countsTitle?: string;
	filterOption?: TFilterOption;
	nightsView?: TNightViewOp;


	//lang의 key로 커스텀 필터의 값정의
	constructor(options: SEARCHER_INIT_OPTION) {
		const { lang, onSearch, nightsView, filterOption, dateFormat,  navBar } = options;
		this.lang = lang;
		this.onSearch = onSearch;
		this.dateFormat = dateFormat;
		this.filterOption = filterOption;
		this.navBar = navBar;
		this.nightsView = nightsView;
	}

	changeLang(lang: TSearcherLang) {
		this.lang = lang;
	}

	start(target: HTMLElement) {
		ReactDOM.render(
			<SEARCHER
			  filterOption={this.filterOption}
			  nightsView={this.nightsView}
			  lang={this.lang}
		      onSearch={this.onSearch}
			  dateFormat={this.dateFormat}
			  navBar={this.navBar}
			/>,
			target
		);
	}
}

if (process.env.NODE_ENV === 'development') {
	const target = document.getElementById("root");
	if (target) {
		const lang: TSearcherLang = {
			nightViewUnit: "박",
			checkIn: "체크인",
			checkOut: "체크아웃",
			rangeLabel: "박",
			roomCount: "방개수",
			searchLabel: "검색",
			adult: "성인",
			child: "소인"
		}
		const countsTitle = "객실 - 투숙인원";
		const onSearch: TOnSearch = (dateData, customNums) => {
			const { from, to } = dateData;
		}

		const filterCounts: TFilterCounts[] = [{
			key: "roomCount",
			defaultValue: 0,
			type: "count"
		}, {
			key: "adult",
			defaultValue: 0,
			type: "count"
		},
		{
			key: "child",
			defaultValue: 0,
			type: "count"
		}
		];

		const navBar: TNavBar = {
			prevButtonProp: {
				className: "eg",
				children: "prev"
			},
			closeButtonProp: {
				className: "close",
				children: "close"
			},
			nextButtonProp: {
				className: "eg",
				children: "next"
			}
		}

		const mySearcher = new JD_SEARCH({
			lang,
			onSearch,
			navBar,
			filterOption: {
				closeBtn: {
					children: "close"
				},
				countsTitle,
				filterCounts
			},
			nightsView: {
				text: (diff) => `${diff}${lang["nightViewUnit"]}`
			}
		});

		mySearcher.start(target);
	}
}

// @ts-ignore
window.JDsearch = JD_SEARCH;
