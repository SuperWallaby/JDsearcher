import React, { useState, useRef, HTMLAttributes, useMemo } from 'react';
import { JDdayPicker, JDbutton } from "@janda-com/front";
import { useDayPicker } from '@janda-com/front';
import Counter from './component/Counter';
import 'moment/locale/ko'
import moment from "moment";
import { IDiv } from '@janda-com/front/build/types/interface';
import $ from "jquery";
moment.locale("ko");
type TdateData = {
    from: Date;
    to: Date;
}

export type TFilterCounts = {
    key: string
    type: "count"
    defaultValue: any
}

export interface TCustomFilter extends TFilterCounts {
    key: string
    type: "count"
    defaultValue: any
}

export type TOnSearch = (dateData: TdateData,urlParams:string, customFilters?: TCustomFilter[]) => void;

export type TSearcherLang = {
    nightViewUnit: string;
    checkIn: string;
    checkOut: string;
    rangeLabel: string;
    searchLabel: string;
    [key: string]: string;
}

export type TNavBar = {
    prevButtonProp: IDiv;
    nextButtonProp: IDiv;
    closeButtonProp: IDiv;
    hideCloseButton?: boolean;
}

export type TFilterOption = {
    closeBtn: IDiv;
    filterCounts?: TCustomFilter[]
    countsTitle?: string;
}

export type TNightViewOp = {
    text: (diff: number) => string;
    props?: IDiv;
}

export interface ISearcherProp {
    lang: TSearcherLang;
    onSearch: TOnSearch;
    // URL 파라미터로 전송
    dateFormat?: string;
    nightsView?: TNightViewOp;
    filterOption?: TFilterOption;
    navBar?: TNavBar;
}

export interface IStartProp { }
export const Searcher: React.FC<ISearcherProp> = ({ nightsView, onSearch, lang, filterOption, navBar }) => {
    const { countsTitle, closeBtn, filterCounts = [] } = filterOption || {
        countsTitle: "",
        filterCounts: []
    };
    const dayPickerHook = useDayPicker(new Date, new Date);
    const refContainer = useRef<HTMLInputElement>(null);
    const [hide, setHide] = useState(false);
    const [customFilters, setCutomFilter] = useState(filterCounts.map(c => ({ value: 0, ...c })));
    const [filterOpen, setFilterOpen] = useState(false);

    const NavBar = ({ onPreviousClick, onNextClick, className }: any) => <div className={className}>
        <div className="JDdayPicker__navBar" onClick={() => {
            setHide(true);
        }} {...navBar?.closeButtonProp} />
        <div className="JDdayPicker__PNbtns">
            <div {...navBar?.prevButtonProp} className={`JDdayPicker__prevBtn ${navBar?.prevButtonProp.className}`} onClick={() => { onPreviousClick() }} ></div>
            <div {...navBar?.nextButtonProp} className={`JDdayPicker__nextBtn ${navBar?.nextButtonProp.className}`} onClick={() => { onNextClick() }}></div>
        </div>
    </div>


    const DateShower = (date: Date, label: string) => (
        <div onClick={() => {
            refContainer.current?.focus();
            setHide(false);
        }} className="JDresvSearcher__dateBox JDresvSearcher__fromBox">
            <span className="JDresvSearcher__dateBoxTitle">{label}</span>
            <div className="JDresvSearcher__dateWrap" >
                <div className="JDresvSearcher__day">{moment(date).format("DD")}</div>
                <div className="JDresvSearcher__dateElseWrap">
                    <div className="JDresvSearcher__month">{moment(date).format("MMM")}</div>
                    <div className="JDresvSearcher__weekDay">{moment(date).local().format("dddd")}</div>
                </div>
            </div>
        </div>)

    const diff = moment(dayPickerHook.to).diff(dayPickerHook.from, "d") || 0;
    const NightViewer = useMemo(() => nightsView ? <div {...nightsView.props} className={`JDresvSearcher__nights ${nightsView.props?.className}`}>
        {nightsView.text(diff)}
    </div> : <span />, [diff])

    return <div className="JDresvSearcher">
        <JDdayPicker isRange hide={hide} navbarElement={NavBar} displayIcon={true} numberOfMonths={2} mode="input" {...dayPickerHook} inputComponent={(prop: any) => <div className="JDresvSearcher__In">
            <div className="JDresvSearcher__datesWrap">
                {DateShower(dayPickerHook.from || new Date, lang["checkIn"])}
                {NightViewer}
                {DateShower(dayPickerHook.to || new Date, lang["checkOut"])}
            </div>
            <input className="JDresvSearcher__input" ref={refContainer} {...prop} />
            <div className="JDresvSearcher__filtersWrap">
                {customFilters.map(({ key, type, value }) =>
                    <div className="JDresvSearcher__filterBox" onClick={() => {
                        setFilterOpen(true)
                    }} key={key}>
                        <div className="JDresvSearcher__filterTitle">{lang[key]}</div>
                        <div className="JDresvSearcher__filterValue">{value}</div>
                    </div>
                )}
                {filterOpen &&
                    <div className="JDresvSearcher__countBoxWrap">
                        <div onClick={() => {
                            setFilterOpen(false);
                        }}
                            {...closeBtn}
                            className={`JDresvSearcher__countBoxCloser ${closeBtn?.className}`}>
                        </div>
                        {countsTitle && <div className="JDresvSearcher__countsTitle">{countsTitle}</div>}
                        <div className="JDresvSearcher__countersWrap">
                            {customFilters.map((cf) => {
                                const { key, type, value } = cf;
                                const label = lang[key];
                                return <Counter centerLabel={label} count={value} handleCount={(flag) => {
                                    cf.value += flag ? 1 : -1;
                                    setCutomFilter([...customFilters]);
                                }} />
                            }
                            )}
                        </div>
                    </div>
                }
            </div>
            <div onClick={() => {
                const {from, to } = dayPickerHook;
                const customParams = customFilters.map(cf => `&${cf.key}=` + cf.value).join("");
                const urlParams = "from=" + moment(from).format("YYYY-MM-DD") + "&to=" + moment(to).format("YYYY-MM-DD") + customParams;
                onSearch({
                    from: dayPickerHook.from!,
                    to: dayPickerHook.to!
                }, urlParams, customFilters)
            }} className="JDresvSearcher__searchBtn">
                {lang["searchLabel"]}
            </div>
        </div>
        } />
    </div>;
};


export default Searcher;