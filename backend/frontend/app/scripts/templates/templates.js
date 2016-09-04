angular.module('theme.templates', []).run(['$templateCache', function ($templateCache) {
  'use strict';

  $templateCache.put('templates/add-appearance-attorney.html',
    "<div id=\"addAreaOfLawModal\" class=\"modal fade\" style=\"z-index:3000; background-color:rgba(0, 0, 0, 0.5);\">\n" +
    "  <div class=\"modal-dialog\" style=\"width:50%;padding-left: 2%;padding-right: 2%; \">\n" +
    "    <div class=\"modal-content\" style=\"margin-top: 8%\">\n" +
    "      <div class=\"modal-header\" style=\"border-bottom:none\">\n" +
    "          <button type=\"button\" id=\"closeModal\" class=\"close\" data-dismiss=\"modal\" aria-hidden=\"true\">&times;</button>\n" +
    "\n" +
    "        <h4 style=\"font-weight: 100;\"><span id=\"CustomerHeading\">&nbsp&nbspAdd Area of Law</span></h4>\n" +
    "        <p id=\"WelcomeMessage\" style=\"margin-left:12px\">\n" +
    "          Please ensure that you fill in all the mandatory sections in the form.\n" +
    "        </p>\n" +
    "      </div>\n" +
    "\n" +
    "      <div class=\"modal-body\" style=\"margin-bottom: none; padding-top: 0px; border-bottom:none\">\n" +
    "\n" +
    "        <!-- Start Form-->\n" +
    "\n" +
    "              <form id =\"applicationForm\" name=\"form\" class=\"css-form\" ng-submit=\"saveApplication()\" novalidate>\n" +
    "                  <div class=\"row\">\n" +
    "                    <span id=\"sectionHeading\" style=\"position:relative;top:10px\">Add Advocate</span>\n" +
    "                    <select id=\"plaintiff\" ui-select2=\"{minimumInputLength: 2, width: 'resolve'}\" ng-model=\"appearance.plaintiff\"  onchange=\"showCustomerDetails()\" style=\"font-weight: 700; width:100%; position: relative; top:10px; vertical-align: middle; background-color: white\" class=\"ng-pristine ng-valid select2-offscreen\" tabindex=\"-1\" title=\"Area of Law\" placeholder = \"Area of Law\" >\n" +
    "                        <option>\n" +
    "                          S. Kaingu\n" +
    "                        </option>\n" +
    "                        <option>\n" +
    "                          M. Ngulube\n" +
    "                        </option>\n" +
    "                        <option>\n" +
    "                          C. Chuula\n" +
    "                        </option>\n" +
    "                    </select>\n" +
    "\n" +
    "                    <span id=\"sectionHeading\" style=\"position:relative;top:15px\">Add Law Firm</span>\n" +
    "                    <select id=\"plaintiff\" ui-select2=\"{minimumInputLength: 2, width: 'resolve'}\" ng-model=\"appearance.plaintiff\"  onchange=\"showCustomerDetails()\" style=\"font-weight: 700; width:100%; position: relative; top:15px; vertical-align: middle; background-color: white\" class=\"ng-pristine ng-valid select2-offscreen\" tabindex=\"-1\" title=\"Area of Law\" placeholder = \"Area of Law\" >\n" +
    "                        <option>\n" +
    "                          S. Kaingu\n" +
    "                        </option>\n" +
    "                        <option>\n" +
    "                          M. Ngulube\n" +
    "                        </option>\n" +
    "                        <option>\n" +
    "                          C. Chuula\n" +
    "                        </option>\n" +
    "                    </select>\n" +
    "\n" +
    "                    <button class=\"btn btn-primary-alt btn-md btn-block\" style=\"position:relative; top:25px\">Add Defendant</button>\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "                  </div>\n" +
    "\n" +
    "                  <div class = \"form-group\">\n" +
    "                    <button id=\"submit\" type=\"submit\" class=\"btn btn-primary-alt pull-right\"  style=\"width:120px\">Save</button>\n" +
    "\n" +
    "\n" +
    "                    <div id=\"submitAppMsg\" class=\"pull-left\" style=\"font-size: larger; position: relative; top: 5px\"></div>\n" +
    "                  </div>\n" +
    "\n" +
    "            </form>\n" +
    "\n" +
    "   </div>\n" +
    "   <div class=\"modal-footer\" style=\"border-top:none\">\n" +
    "\n" +
    "\n" +
    "    </div>\n" +
    " </div>\n" +
    "</div>\n" +
    "</div>\n"
  );


  $templateCache.put('templates/add-case-modal.html',
    "<div id=\"addCaseModal\" class=\"modal fade\" style=\"z-index:2000;\">\n" +
    "  <div class=\"modal-dialog\" style=\"width:65%;padding-left: 2%;padding-right: 2%;\">\n" +
    "    <div class=\"modal-content\" style=\"margin-top: 8%\">\n" +
    "      <div class=\"modal-header\" style=\"margin-bottom:20px\">\n" +
    "          <button type=\"button\" id=\"closeModal\" class=\"close\" data-dismiss=\"modal\" aria-hidden=\"true\">&times;</button>\n" +
    "\n" +
    "        <h4 style=\"font-weight: 100;\"><span id=\"CustomerHeading\">&nbsp&nbspAdd Case</span></h4>\n" +
    "        <p id=\"WelcomeMessage\" style=\"margin-left:8px; margin-top:-10px\">\n" +
    "          Please ensure that you fill in all the mandatory sections in the form.\n" +
    "        </p>\n" +
    "      </div>\n" +
    "\n" +
    "      <div class=\"modal-body\" style=\"margin-bottom: none; padding-top: 0px; border-bottom:none\">\n" +
    "\n" +
    "        <!-- Start Form-->\n" +
    "\n" +
    "        <form id =\"applicationForm\" name=\"form\" class=\"css-form\" ng-submit=\"saveApplication()\" novalidate>\n" +
    "                  <div class=\"row\">\n" +
    "                    <div class=\"col-xs-6 form-group\">\n" +
    "                      <input id=\"caseNumber\" name=\"caseNumber\" type=\"text\" class=\"form-control\" ng-model=\"case.caseNumber\" ng-minlength=2 ng-focus placeholder=\"Case Number\"/>\n" +
    "                      <div class=\"text-danger\" ng-show=\"form.$submitted && form.caseNumber.$invalid || form.caseNumber.$dirty && form.caseNumber.$invalid && !form.caseNumber.$focused\">\n" +
    "                        <span><i class=\"fa fa-exclamation-circle\"></i></span>\n" +
    "                        <span ng-show=\"form.caseNumber.$error.required\">Case Number is required</span>\n" +
    "                        <span ng-show=\"form.caseNumber.$error.minlength\">Case Number is required to be at least 2 characters long</span>\n" +
    "\n" +
    "                      </div>\n" +
    "                    </div>\n" +
    "                    <div class=\"col-xs-6 form-group\">\n" +
    "\n" +
    "                      <ui-select ng-model=\"case.areaOfLaw\" theme=\"selectize\" title=\"Area of Law\" id=\"areaOfLaw\">\n" +
    "                          <ui-select-match placeholder=\"Area of Law\">{{$select.selected.name}}</ui-select-match>\n" +
    "                          <ui-select-choices repeat=\"area in areasOfLaw | filter:$select.search\">\n" +
    "                            <span ng-bind-html=\"area.name | highlight: $select.search\"></span>\n" +
    "\n" +
    "                          </ui-select-choices>\n" +
    "                      </ui-select>\n" +
    "\n" +
    "\n" +
    "                    </div>\n" +
    "                    <div class=\"col-xs-12\" ng-style = \"{'text-align':(case.parties.plaintiffs.length == 0 && case.parties.defendants.length == 0)?'center':'left'}\" style=\"border:1px dashed #d3d3d3; border-radius:5px; height:auto; color:#d3d3d3; padding-top:20px; padding-bottom:0px; width:97%; margin-left:12px; margin-bottom:20px;\">\n" +
    "                      <!-- <a ng-click=\"addCaseParties()\"><i style=\"font-size:2em; position:absolute; top:20px; right:20px; z-index:10000\" class=\"fa fa-plus\"></i></a> -->\n" +
    "                      <br/>\n" +
    "\n" +
    "                      <div class=\"row\" style=\"padding-bottom:20px\">\n" +
    "\n" +
    "\n" +
    "                          <div class=\"col-xs-6\" style=\"margin-top:-35px\">\n" +
    "\n" +
    "\n" +
    "                            <div ng-controller = \"SynonymController\" style=\"margin-top:10px\">\n" +
    "\n" +
    "\n" +
    "                                    <div class=\"form-group\" >\n" +
    "                                      <ui-select ng-model=\"case.plaintiffSynonym\" theme=\"selectize\" title=\"Court\" id=\"court\">\n" +
    "                                          <ui-select-match placeholder=\"Synonym for Accuser\">{{$select.selected.synonym}}</ui-select-match>\n" +
    "                                          <ui-select-choices repeat=\"synonym in plaintiffSynonyms | filter:$select.search\">\n" +
    "                                            <span ng-bind-html=\"synonym.synonym | highlight: $select.search\"></span>\n" +
    "\n" +
    "                                          </ui-select-choices>\n" +
    "                                      </ui-select>\n" +
    "\n" +
    "                                    </div>\n" +
    "\n" +
    "\n" +
    "                              </div>\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "                            <div>\n" +
    "\n" +
    "                                <input ng-repeat=\"plaintiff in case.plaintiffs\" set-focus=\"$last\" id=\"plaintiff\" name=\"plaintiff\" type=\"text\" class=\"form-control\" ng-model=\"plaintiff.name\" ng-minlength=2 ng-focus required placeholder=\"Name of Plaintiff\" ng-keydown = \"addPlaintiff($event)\" ng-style=\"{'margin-bottom':(case.parties.plaintiffs.length == 1)?'0px':'10px'}\"/>\n" +
    "                                <div class=\"text-danger\" ng-show=\"form.$submitted && form.plaintiff.$invalid || form.plaintiff.$dirty && form.plaintiff.$invalid && !form.plaintiff.$focused\">\n" +
    "\n" +
    "                                  <span ng-show=\"form.plaintiff.$error.required\">Name of Plaintiff is required</span>\n" +
    "                                  <span ng-show=\"form.plaintiff.$error.minlength\">Name of Plaintiff is required to be at least 2 characters long</span>\n" +
    "\n" +
    "                                </div>\n" +
    "                            </div>\n" +
    "\n" +
    "                          </div>\n" +
    "\n" +
    "\n" +
    "                          <div class=\"col-xs-6\" style=\"margin-top:-35px\">\n" +
    "\n" +
    "\n" +
    "\n" +
    "                            <div ng-controller = \"SynonymController\" style=\"margin-top:10px\">\n" +
    "\n" +
    "\n" +
    "                                    <div class=\"form-group\" >\n" +
    "                                      <ui-select ng-model=\"case.defendantSynonym\" theme=\"selectize\" title=\"Court\" id=\"court\">\n" +
    "                                          <ui-select-match placeholder=\"Synonym for Accused\">{{$select.selected.synonym}}</ui-select-match>\n" +
    "                                          <ui-select-choices repeat=\"synonym in defendantSynonyms | filter:$select.search\">\n" +
    "                                            <span ng-bind-html=\"synonym.synonym | highlight: $select.search\"></span>\n" +
    "\n" +
    "                                          </ui-select-choices>\n" +
    "                                      </ui-select>\n" +
    "\n" +
    "                                    </div>\n" +
    "\n" +
    "\n" +
    "                              </div>\n" +
    "                            <div >\n" +
    "                                <input ng-repeat=\"defendant in case.defendants\" set-focus=\"$last\" id=\"defendant\" name=\"defendant\" type=\"text\" class=\"form-control\" ng-model=\"defendant.name\" ng-minlength=2 ng-focus required placeholder=\"Name of Defendant\" ng-keydown = \"addDefendant($event)\" ng-style=\"{'margin-bottom':(case.parties.defendants.length == 1)?'0px':'10px'}\"/>\n" +
    "                                <div class=\"text-danger\" ng-show=\"form.$submitted && form.defendant.$invalid || form.defendant.$dirty && form.defendant.$invalid && !form.defendant.$focused\">\n" +
    "\n" +
    "                                  <span ng-show=\"form.defendant.$error.required\">Name of Defendant is required</span>\n" +
    "                                  <span ng-show=\"form.defendant.$error.minlength\">Name of Defendant is required to be at least 2 characters long</span>\n" +
    "\n" +
    "                                </div>\n" +
    "                            </div>\n" +
    "\n" +
    "                          </div>\n" +
    "                        </div>\n" +
    "\n" +
    "                        <div class=\"row\" style=\"border-top:1px dashed #d3d3d3; background-color:#f9f9f9; padding-bottom:20px;\">\n" +
    "\n" +
    "\n" +
    "                            <div class=\"col-xs-6\" style=\"margin-top:0px\">\n" +
    "                              <h4 ng-if=\"case.plaintiffSynonym\">Appearances{{+\" for \"+case.plaintiffSynonym.synonym+\"s\"}}</h4><h4 ng-if=\"!case.plaintiffSynonym\">Appearances</h4>\n" +
    "                              <div ng-repeat=\"appearance in case.appearancesForPlaintiffs\" >\n" +
    "\n" +
    "                                  <div class=\"row\">\n" +
    "                                      <div class=\"col-xs-6\">\n" +
    "                                        <input set-focus=\"$last\" id=\"plaintiffAdvocate\" name=\"plaintiffAdvocate\" type=\"text\" class=\"form-control\" ng-model=\"appearance.advocate\" ng-minlength=2 ng-focus required placeholder=\"Advocate\" ng-keydown = \"\" ng-style=\"{'margin-bottom':(case.parties.plaintiffAdvocates.length == 1)?'0px':'10px'}\"/>\n" +
    "\n" +
    "                                      </div>\n" +
    "                                      <div class=\"col-xs-6\">\n" +
    "                                        <input id=\"plaintiffFirm\" name=\"plaintiffFirm\" type=\"text\" class=\"form-control\" ng-model=\"appearance.lawFirm\" ng-minlength=2 ng-focus required placeholder=\"Law Firm\" ng-keydown = \"addPlaintiffAdvocate($event)\" ng-style=\"{'margin-bottom':(case.parties.plaintiffAdvocates.length == 1)?'0px':'10px'}\"/>\n" +
    "\n" +
    "                                      </div>\n" +
    "                                  </div>\n" +
    "                              </div>\n" +
    "\n" +
    "                              <div class=\"row\">\n" +
    "                                <div class=\"col-xs-6 text-danger\" ng-show=\"form.$submitted && form.plaintiffAdvocate.$invalid || form.plaintiffAdvocate.$dirty && form.plaintiffAdvocate.$invalid && !form.plaintiffAdvocate.$focused\">\n" +
    "\n" +
    "                                  <span ng-show=\"form.plaintiffAdvocate.$error.required\">Name of Advocate is required</span>\n" +
    "                                  <span ng-show=\"form.plaintiffAdvocate.$error.minlength\">Name of Advocate is required to be at least 2 characters long</span>\n" +
    "\n" +
    "                                </div>\n" +
    "\n" +
    "                                <div class=\"col-xs-6 text-danger pull-right\" ng-show=\"form.$submitted && form.plaintiffFirm.$invalid || form.plaintiffFirm.$dirty && form.plaintiffFirm.$invalid && !form.plaintiffFirm.$focused\">\n" +
    "\n" +
    "                                  <span ng-show=\"form.plaintiffFirm.$error.required\">Name of Law Firm is required</span>\n" +
    "                                  <span ng-show=\"form.plaintiffFirm.$error.minlength\">Name of Law Firm is required to be at least 2 characters long</span>\n" +
    "\n" +
    "                                </div>\n" +
    "                              </div>\n" +
    "\n" +
    "                            </div>\n" +
    "\n" +
    "\n" +
    "                            <div class=\"col-xs-6\" style=\"margin-top:0px\">\n" +
    "\n" +
    "\n" +
    "\n" +
    "                              <h4 ng-if=\"case.defendantSynonym\">Appearances{{+\" for \"+case.defendantSynonym.synonym+\"s\"}}</h4><h4 ng-if=\"!case.defendantSynonym\">Appearances</h4>\n" +
    "                              <div ng-repeat=\"appearance in case.appearancesForDefendants\">\n" +
    "                                <div class=\"row\">\n" +
    "                                    <div class=\"col-xs-6\">\n" +
    "                                      <input  set-focus=\"$last\" id=\"defendantAdvocate\" name=\"defendantAdvocate\" type=\"text\" class=\"form-control\" ng-model=\"appearance.advocate\" ng-minlength=2 ng-focus required placeholder=\"Advocate\" ng-keydown = \"\" ng-style=\"{'margin-bottom':(case.parties.defendantAdvocates.length == 1)?'0px':'10px'}\"/>\n" +
    "\n" +
    "                                    </div>\n" +
    "                                    <div class=\"col-xs-6\">\n" +
    "                                      <input  id=\"defendantFirm\" name=\"defendantFirm\" type=\"text\" class=\"form-control\" ng-model=\"appearance.lawFirm\" ng-minlength=2 ng-focus required placeholder=\"Law Firm\" ng-keydown = \"addDefendantAdvocate($event)\" ng-style=\"{'margin-bottom':(case.parties.defendantAdvocates.length == 1)?'0px':'10px'}\"/>\n" +
    "\n" +
    "                                    </div>\n" +
    "                                </div>\n" +
    "                              </div>\n" +
    "                              <div class=\"row\">\n" +
    "                                <div class=\"col-xs-6 text-danger\" ng-show=\"form.$submitted && form.defendantAdvocate.$invalid || form.defendantAdvocate.$dirty && form.defendantAdvocate.$invalid && !form.defendantAdvocate.$focused\">\n" +
    "\n" +
    "                                  <span ng-show=\"form.defendantAdvocate.$error.required\">Name of Advocate is required</span>\n" +
    "                                  <span ng-show=\"form.defendantAdvocate.$error.minlength\">Name of Advocate is required to be at least 2 characters long</span>\n" +
    "\n" +
    "                                </div>\n" +
    "                                <div class=\"col-xs-6 text-danger pull-right\" ng-show=\"form.$submitted && form.defendantFirm.$invalid || form.defendantFirm.$dirty && form.defendantFirm.$invalid && !form.defendantFirm.$focused\">\n" +
    "\n" +
    "                                  <span ng-show=\"form.defendantFirm.$error.required\">Name of Law Firm is required</span>\n" +
    "                                  <span ng-show=\"form.defendantFirm.$error.minlength\">Name of Law Firm is required to be at least 2 characters long</span>\n" +
    "\n" +
    "                                </div>\n" +
    "                              </div>\n" +
    "\n" +
    "                            </div>\n" +
    "                          </div>\n" +
    "                      <span ng-show=\"case.parties.plaintiffs.length == 0 && case.parties.defendants.length == 0\" style=\"font-size:1.5em; font-weight:100\">Add Parties</span>\n" +
    "\n" +
    "                    </div>\n" +
    "                  </div>\n" +
    "\n" +
    "                  <div class=\"row\">\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "                    <div class=\"col-xs-12\" style=\"border:1px dashed #d3d3d3; border-radius:5px; height:auto; color:#d3d3d3; padding-top:10px; padding-bottom:20px; width:97%; margin-left:12px; margin-bottom:20px;\">\n" +
    "                      <h4>Coram</h4>\n" +
    "                      <input ng-repeat=\"judge in case.coram\" set-focus=\"$last\" id=\"judge\" name=\"judge\" type=\"text\" class=\"form-control\" ng-model=\"judge.name\" ng-minlength=2 ng-focus required placeholder=\"Name of Judge\" ng-keydown = \"addJudge($event)\" ng-style=\"{'margin-bottom':(case.coram.length == 1)?'0px':'10px'}\"/>\n" +
    "                      <div class=\"text-danger\" ng-show=\"form.$submitted && form.coram.$invalid || form.coram.$dirty && form.coram.$invalid && !form.coram.$focused\">\n" +
    "\n" +
    "                        <span ng-show=\"form.coram.$error.required\">Name of Judge is required</span>\n" +
    "                        <span ng-show=\"form.coram.$error.minlength\">Name of Judge is required to be at least 2 characters long</span>\n" +
    "\n" +
    "                      </div>\n" +
    "                    </div>\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "                  </div>\n" +
    "\n" +
    "                  <div class=\"row\">\n" +
    "                  <div class=\"col-xs-12\" style=\"border:1px dashed #d3d3d3; border-radius:5px; height:auto; color:#d3d3d3; padding-top:10px; padding-bottom:20px; width:97%; margin-left:12px; margin-bottom:20px;\">\n" +
    "                        <h4>Citation Details</h4>\n" +
    "                        <div class=\"row\">\n" +
    "\n" +
    "                        <div class=\"col-xs-3 form-group\">\n" +
    "                          <input id=\"citation-number\" type=\"text\" class=\"form-control \" ng-model=\"case.citation.number\" name=\"citation-number\" ng-minlength = 1 ng-focus placeholder=\"Citation Number\" />\n" +
    "                          <div class=\"alert alert-danger\" ng-show=\"form.$submitted && form.contactNumber.$invalid || form.contactNumber.$dirty && form.contactNumber.$invalid && !form.contactNumberNumber.$focused\">\n" +
    "\n" +
    "                            <span ng-show=\"form.citation-number.$error.required\">Citation Number is required</span>\n" +
    "                            <span ng-show=\"form.citation-number.$error.minlength\">Citation Number is required to be at least 2 characters long.</span>\n" +
    "\n" +
    "                          </div>\n" +
    "                        </div>\n" +
    "\n" +
    "                         <div class=\"col-xs-3 form-group\">\n" +
    "                          <input id=\"citation-year\" type=\"number\" class=\"form-control \" ng-model=\"case.citation.year\" name=\"citation-year\" ng-minlength = 2 optional ng-focus placeholder=\"Citation Year\" />\n" +
    "                          <div class=\"text-danger\" ng-show=\"form.$submitted && form.citation-year.$invalid || form.citation-year.$dirty && form.citation-year.$invalid && !form.citation-year.$focused\">\n" +
    "\n" +
    "                            <span ng-show=\"form.citation-year.$error.required\">Citation Year is required.</span>\n" +
    "                            <span ng-show=\"form.citation-year.$error.minlength\">Citation Year is required to be at least 2 characters long.</span>\n" +
    "                          </div>\n" +
    "                        </div>\n" +
    "\n" +
    "\n" +
    "                       <div class=\"col-xs-3 form-group\">\n" +
    "                        <input id=\"citation-code\" name=\"citation-code\" type=\"text\" class=\"form-control \" ng-model=\"case.citation.code\"  ng-minlength = 2 optional ng-focus placeholder=\"Citation Code\" />\n" +
    "                        <div class=\"alert alert-danger\" ng-show=\"form.$submitted && form.citation-code.$invalid || form.citation-code.$dirty && form.citation-code.$invalid && !form.citation-code.$focused\">\n" +
    "\n" +
    "\n" +
    "                          <span ng-show=\"form.citation-code.$error.required\">Citation Code is required.</span>\n" +
    "                          <span ng-show=\"form.citation-code.$error.minlength\">Citation Year is required to be at least 2 characters long.</span>\n" +
    "\n" +
    "                        </div>\n" +
    "                      </div>\n" +
    "\n" +
    "                      <div class=\"col-xs-3 form-group\">\n" +
    "                       <input id=\"citation-page-number\" name=\"citation-page-number\" type=\"number\" class=\"form-control \" ng-model=\"case.citation.pageNumber\"  ng-minlength = 1 optional ng-focus placeholder=\"Citation Page Number\" />\n" +
    "                       <div class=\"text-danger\" ng-show=\"form.$submitted && form.citation-page-number.$invalid || form.citation-page-number.$dirty && form.citation-page-number.$invalid && !form.citation-page-number.$focused\">\n" +
    "\n" +
    "\n" +
    "                         <span ng-show=\"form.citation-page-number.$error.required\">Citation Page Number is required.</span>\n" +
    "                         <span ng-show=\"form.citation-page-number.$error.minlength\">Citation Page Number is required to be at least 2 characters long.</span>\n" +
    "                       </div>\n" +
    "                     </div>\n" +
    "\n" +
    "\n" +
    "\n" +
    "                     </div>\n" +
    "\n" +
    "                   </div>\n" +
    "\n" +
    "                 </div>\n" +
    "\n" +
    "                 <div class=\"row\">\n" +
    "\n" +
    "                   <div class=\"col-xs-12\" style=\"border:1px dashed #d3d3d3; border-radius:5px; height:auto; color:#d3d3d3; padding-top:10px; padding-bottom:20px; width:97%; margin-left:12px; margin-bottom:20px;\">\n" +
    "                         <h4>Court Details</h4>\n" +
    "                         <div class=\"row\" >\n" +
    "                           <div ng-controller = \"CourtController\">\n" +
    "\n" +
    "\n" +
    "                             <div class=\"col-xs-3 form-group\" >\n" +
    "                               <ui-select ng-model=\"case.court\" theme=\"selectize\" title=\"Court\" id=\"court\">\n" +
    "                                   <ui-select-match placeholder=\"Court\">{{$select.selected.name}}</ui-select-match>\n" +
    "                                   <ui-select-choices repeat=\"court in courts | filter:$select.search\" ng-click = \"divisionsForCourt(court.id)\">\n" +
    "                                     <span ng-bind-html=\"court.name | highlight: $select.search\"></span>\n" +
    "\n" +
    "                                   </ui-select-choices>\n" +
    "                               </ui-select>\n" +
    "\n" +
    "                             </div>\n" +
    "\n" +
    "                             <div class=\"col-xs-3 form-group\">\n" +
    "                               <ui-select ng-model=\"case.division\" theme=\"selectize\">\n" +
    "                                   <ui-select-match placeholder=\"Court Division\">{{$select.selected.name}}</ui-select-match>\n" +
    "                                   <ui-select-choices repeat=\"division in divisions | filter: $select.search\">\n" +
    "                                     <span ng-bind-html=\"division.name | highlight: $select.search\"></span>\n" +
    "\n" +
    "                                   </ui-select-choices>\n" +
    "                               </ui-select>\n" +
    "                             </div>\n" +
    "\n" +
    "                             </div>\n" +
    "\n" +
    "\n" +
    "                             <div class=\"col-xs-3 form-group\">\n" +
    "                               <ui-select ng-model=\"case.location\" theme=\"selectize\">\n" +
    "                                   <ui-select-match placeholder=\"Location\">{{$select.selected.name}}</ui-select-match>\n" +
    "                                   <ui-select-choices repeat=\"location in locations | filter: $select.search\">\n" +
    "                                     <span ng-bind-html=\"location.name | highlight: $select.search\"></span>\n" +
    "\n" +
    "                                   </ui-select-choices>\n" +
    "                               </ui-select>\n" +
    "                             </div>\n" +
    "\n" +
    "                             <div class=\"col-xs-3 form-group\">\n" +
    "                               <ui-select ng-model=\"case.jurisdiction\" theme=\"selectize\">\n" +
    "                                   <ui-select-match placeholder=\"Jurisdiction\">{{$select.selected.name}}</ui-select-match>\n" +
    "                                   <ui-select-choices repeat=\"jurisdiction in jurisdictions | filter: $select.search\">\n" +
    "                                     <span ng-bind-html=\"jurisdiction.name | highlight: $select.search\"></span>\n" +
    "\n" +
    "                                   </ui-select-choices>\n" +
    "                               </ui-select>\n" +
    "                             </div>\n" +
    "                          </div>\n" +
    "                      </div>\n" +
    "\n" +
    "                   <div class=\"col-xs-12\" style=\"border:1px dashed #d3d3d3; border-radius:5px; height:auto; color:#d3d3d3; padding-top:10px; padding-bottom:20px; width:97%; margin-left:12px; margin-bottom:20px;\">\n" +
    "                         <h4>References</h4>\n" +
    "                         <div class=\"row\">\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "                             <div class=\"col-xs-4 form-group\" ng-controller = \"LegislationController\">\n" +
    "\n" +
    "\n" +
    "                               <ui-select multiple ng-model=\"case.legislationsReferedTo\" theme=\"bootstrap\">\n" +
    "                                   <ui-select-match placeholder=\"Select Legislations Referred To...\">{{$item.legislationName}} {{$item.dateOfAssent | date : 'yyyy'}}</ui-select-match>\n" +
    "                                   <ui-select-choices repeat=\"legislation in legislations | filter: $select.search\">\n" +
    "                                     <span ng-bind-html=\"legislation.legislationNumber | highlight: $select.search\"></span>&nbsp;-\n" +
    "                                     <span ng-bind-html=\"legislation.legislationName | highlight: $select.search\"></span>\n" +
    "                                     <small ng-bind-html=\"legislation.dateOfAssent | date : 'yyyy' | highlight: $select.search\"></small>\n" +
    "                                   </ui-select-choices>\n" +
    "                               </ui-select>\n" +
    "                             </div>\n" +
    "\n" +
    "                             <div class=\"col-xs-4 form-group\">\n" +
    "\n" +
    "\n" +
    "                               <ui-select multiple ng-model=\"case.casesReferedTo\" theme=\"bootstrap\">\n" +
    "                                   <ui-select-match placeholder=\"Select Cases Referred To...\">{{$item.name}}</ui-select-match>\n" +
    "                                   <ui-select-choices repeat=\"case in cases | filter: $select.search\">\n" +
    "                                     <span ng-bind-html=\"case.name | highlight: $select.search\"></span>\n" +
    "                                     <small ng-bind-html=\"case.citation.year | highlight: $select.search\"></small>\n" +
    "                                   </ui-select-choices>\n" +
    "                               </ui-select>\n" +
    "                             </div>\n" +
    "\n" +
    "\n" +
    "                             <div class=\"col-xs-4 form-group\" ng-controller=\"WorkReferenceController\">\n" +
    "\n" +
    "\n" +
    "                               <ui-select multiple ng-model=\"case.worksReferedTo\" theme=\"bootstrap\">\n" +
    "                                   <ui-select-match placeholder=\"Select Works Referred To...\">{{$item.name}}</ui-select-match>\n" +
    "                                   <ui-select-choices repeat=\"work in works | filter: $select.search\">\n" +
    "                                     <span ng-bind-html=\"work.name | highlight: $select.search\"></span>\n" +
    "\n" +
    "                                   </ui-select-choices>\n" +
    "                               </ui-select>\n" +
    "\n" +
    "\n" +
    "\n" +
    "                             </div>\n" +
    "                             </div>\n" +
    "                              </div>\n" +
    "                     </div>\n" +
    "\n" +
    "                    <div class=\"row\">\n" +
    "\n" +
    "                      <div class=\"col-xs-12\" style=\"border:1px dashed #d3d3d3; border-radius:5px; height:auto; color:#d3d3d3; padding-top:10px; padding-bottom:20px; width:97%; margin-left:12px; margin-bottom:20px;\">\n" +
    "                            <h4>Ruling</h4>\n" +
    "                            <div class=\"row\">\n" +
    "                                  <div class=\"col-xs-12 col-md-6 form-group\">\n" +
    "                                      <textarea id=\"summaryOfFacts\" name=\"summaryOfFacts\" type=\"text\" style=\"height: 90px\" min-word-count=\"2\"  class=\"form-control\" ng-model=\"case.summaryOfFacts\"  ng-minlength=2 required ng-focus placeholder=\"Summary of Facts\"/>\n" +
    "                                      <div class=\"text-danger\" ng-show=\"form.$submitted && form.summaryOfFacts.$invalid || form.summaryOfFacts.$dirty && form.summaryOfFacts.$invalid && !form.summaryOfFacts.$focused\">\n" +
    "\n" +
    "                                      <span ng-show=\"form.summaryOfFacts.$error.required\">Summary of Facts is required</span>\n" +
    "                                      <span ng-show=\"form.summaryOfFacts.$error.minlength\">Summary of Facts is required to be at least 2 characters long</span>\n" +
    "\n" +
    "                                    </div>\n" +
    "                                  </div>\n" +
    "\n" +
    "                                  <div class=\"col-xs-12 col-md-6 form-group\">\n" +
    "                                      <textarea id=\"summaryOfRuling\" name=\"summaryOfRuling\" type=\"text\" style=\"height: 90px\" min-word-count=\"2\" class=\"form-control\" ng-model=\"case.summaryOfRuling\" ng-minlength=2 required ng-focus placeholder=\"Summary of Ruling\"/>\n" +
    "                                      <div class=\"text-danger\" ng-show=\"form.$submitted && form.summaryOfRuling.$invalid || form.summaryOfRuling.$dirty && form.summaryOfRuling.$invalid && !form.summaryOfRuling.$focused\">\n" +
    "\n" +
    "                                      <span ng-show=\"form.summaryOfRuling.$error.required\">Summary of Ruling is required</span>\n" +
    "                                      <span ng-show=\"form.summaryOfRuling.$error.minlength\">Summary of Ruling is required to be at least 2 characters long</span>\n" +
    "\n" +
    "                                    </div>\n" +
    "                                  </div>\n" +
    "\n" +
    "                                  <div class=\"col-xs-12 form-group\">\n" +
    "                                      <textarea ng-model=\"case.judgement\" id=\"judgement\" name=\"judgement\" type=\"text\" style=\"height: 90px\" min-word-count=\"2\" max-word-count=\"100\" class=\"form-control\" ng-minlength=2 required ng-focus placeholder=\"Judgement\"/>\n" +
    "                                      <div class=\"text-danger\" ng-show=\"form.$submitted && form.judgement.$invalid || form.judgement.$dirty && form.judgement.$invalid && !form.judgement.$focused\">\n" +
    "\n" +
    "                                      <span ng-show=\"form.judgement.$error.required\">Judgement is required</span>\n" +
    "                                      <span ng-show=\"form.judgement.$error.minlength\">Judgement is required to be at least 2 characters long</span>\n" +
    "\n" +
    "                                    </div>\n" +
    "                                  </div>\n" +
    "                            </div>\n" +
    "                      </div>\n" +
    "\n" +
    "\n" +
    "                  </div>\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "        </form>  <!--End Form-->\n" +
    "\n" +
    "\n" +
    "     <!--  </div>  -->\n" +
    "\n" +
    "  </div>\n" +
    "  <div class=\"modal-footer\" style=\"\">\n" +
    "    <div class=\"row\">\n" +
    "      <div class = \"form-group col-xs-3 col-xs-offset-9\">\n" +
    "\n" +
    "        <button id=\"submit\" type=\"submit\" class=\"btn btn-primary-alt btn-block btn-md\" style=\"\" ng-click=\"saveCase()\">Save Case</button>\n" +
    "\n" +
    "      </div>\n" +
    "    </div>\n" +
    "\n" +
    "   </div>\n" +
    "</div>\n" +
    "</div>\n"
  );


  $templateCache.put('templates/area-of-law-modal.html',
    "<div id=\"addAreaOfLawModal\" class=\"modal fade\" style=\"z-index:3000; background-color:rgba(0, 0, 0, 0.5);\">\n" +
    "  <div class=\"modal-dialog\" style=\"width:50%;padding-left: 2%;padding-right: 2%; \">\n" +
    "    <div class=\"modal-content\" style=\"margin-top: 8%\">\n" +
    "      <div class=\"modal-header\" style=\"border-bottom:none\">\n" +
    "          <button type=\"button\" id=\"closeModal\" class=\"close\" data-dismiss=\"modal\" aria-hidden=\"true\">&times;</button>\n" +
    "\n" +
    "        <h4 style=\"font-weight: 100;\"><span id=\"CustomerHeading\">&nbsp&nbspAdd Area of Law</span></h4>\n" +
    "        <p id=\"WelcomeMessage\" style=\"margin-left:12px\">\n" +
    "          Please ensure that you fill in all the mandatory sections in the form.\n" +
    "        </p>\n" +
    "      </div>\n" +
    "\n" +
    "      <div class=\"modal-body\" style=\"margin-bottom: none; padding-top: 0px; border-bottom:none\">\n" +
    "\n" +
    "        <!-- Start Form-->\n" +
    "\n" +
    "              <form id =\"applicationForm\" name=\"form\" class=\"css-form\" ng-submit=\"saveApplication()\" novalidate>\n" +
    "                  <div class=\"row\">\n" +
    "\n" +
    "\n" +
    "                    <div class=\"col-xs-12 form-group\">\n" +
    "                      <input id=\"area-name\" name=\"area-name\" type=\"text\" class=\"form-control\" ng-model=\"areaOfLaw.name\" ng-minlength=2 ng-focus required placeholder=\"Name of Area\"/>\n" +
    "                      <div class=\"text-danger\" ng-show=\"form.$submitted && form.name.$invalid || form.name.$dirty && form.name.$invalid && !form.name.$focused\">\n" +
    "\n" +
    "                        <span ng-show=\"form.name.$error.required\">Name of Area is required</span>\n" +
    "                        <span ng-show=\"form.name.$error.minlength\">Name of Area is required to be at least 2 characters long</span>\n" +
    "\n" +
    "                      </div>\n" +
    "                    </div>\n" +
    "\n" +
    "\n" +
    "\n" +
    "                  </div>\n" +
    "\n" +
    "                  <div class = \"form-group\">\n" +
    "                    <button id=\"submit\" type=\"submit\" class=\"btn btn-primary-alt pull-right\"  style=\"width:120px\" ng-click=\"saveAreaOfLaw()\">Save</button>\n" +
    "\n" +
    "\n" +
    "                    <div id=\"submitAppMsg\" class=\"pull-left\" style=\"font-size: larger; position: relative; top: 5px\"></div>\n" +
    "                  </div>\n" +
    "\n" +
    "            </form>\n" +
    "\n" +
    "   </div>\n" +
    "   <div class=\"modal-footer\" style=\"border-top:none\">\n" +
    "\n" +
    "\n" +
    "    </div>\n" +
    " </div>\n" +
    "</div>\n" +
    "</div>\n"
  );


  $templateCache.put('templates/bs-modal.html',
    "<div class=\"modal-header\">\n" +
    "    <h3 class=\"modal-title\">I'm a modal!</h3>\n" +
    "</div>\n" +
    "<div class=\"modal-body\">\n" +
    "    <ul>\n" +
    "        <li ng-repeat=\"item in items\">\n" +
    "            <a ng-click=\"selected.item = item\">{{ item }}</a>\n" +
    "        </li>\n" +
    "    </ul>\n" +
    "    Selected: <b>{{ selected.item }}</b>\n" +
    "</div>\n" +
    "<div class=\"modal-footer\">\n" +
    "    <button class=\"btn btn-primary\" ng-click=\"ok()\">OK</button>\n" +
    "    <button class=\"btn btn-warning\" ng-click=\"cancel()\">Cancel</button>\n" +
    "</div>\n"
  );


  $templateCache.put('templates/contextual-progressbar.html',
    "<div class=\"contextual-progress\">\n" +
    "\t<div class=\"clearfix\">\n" +
    "\t\t<div class=\"progress-title\">{{heading}}</div>\n" +
    "\t\t<div class=\"progress-percentage\">{{percent | number:0}}%</div>\n" +
    "\t</div>\n" +
    "\t<div class=\"progress\">\n" +
    "\t\t<div class=\"progress-bar\" ng-class=\"type && 'progress-bar-' + type\" role=\"progressbar\" aria-valuenow=\"{{value}}\" aria-valuemin=\"0\" aria-valuemax=\"{{max}}\" ng-style=\"{width: percent + '%'}\" aria-valuetext=\"{{percent | number:0}}%\" ng-transclude></div>\n" +
    "\t</div>\n" +
    "</div>\n"
  );


  $templateCache.put('templates/court-modal.html',
    "<div id=\"addCourtModal\" class=\"modal fade\" style=\"z-index:3000; background-color:rgba(0, 0, 0, 0.5);\">\n" +
    "  <div class=\"modal-dialog\" style=\"width:50%;padding-left: 2%;padding-right: 2%; \">\n" +
    "    <div class=\"modal-content\" style=\"margin-top: 8%\">\n" +
    "      <div class=\"modal-header\" style=\"border-bottom:none\">\n" +
    "          <button type=\"button\" id=\"closeModal\" class=\"close\" data-dismiss=\"modal\" aria-hidden=\"true\">&times;</button>\n" +
    "\n" +
    "        <h4 style=\"font-weight: 100;\"><span id=\"CustomerHeading\">&nbsp&nbspAdd Court</span></h4>\n" +
    "        <p id=\"WelcomeMessage\" style=\"margin-left:12px\">\n" +
    "          Please ensure that you fill in all the mandatory sections in the form.\n" +
    "        </p>\n" +
    "      </div>\n" +
    "\n" +
    "      <div class=\"modal-body\" style=\"margin-bottom: none; padding-top: 0px; border-bottom:none\">\n" +
    "\n" +
    "        <!-- Start Form-->\n" +
    "\n" +
    "              <form id =\"applicationForm\" name=\"form\" class=\"css-form\" ng-submit=\"saveApplication()\" novalidate>\n" +
    "                  <div class=\"row\">\n" +
    "\n" +
    "\n" +
    "                    <div class=\"col-xs-12 form-group\">\n" +
    "                      <input id=\"court-name\" name=\"court-name\" type=\"text\" class=\"form-control\" ng-model=\"court.name\" ng-minlength=2 ng-focus required placeholder=\"Name of Court\"/>\n" +
    "                      <div class=\"text-danger\" ng-show=\"form.$submitted && form.court-name.$invalid || form.court-name.$dirty && form.court-name.$invalid && !form.court-name.$focused\">\n" +
    "\n" +
    "                        <span ng-show=\"form.court-name.$error.required\">Name of Court is required</span>\n" +
    "                        <span ng-show=\"form.court-name.$error.minlength\">Name of Court is required to be at least 2 characters long</span>\n" +
    "\n" +
    "                      </div>\n" +
    "                    </div>\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "                  </div>\n" +
    "\n" +
    "                  <div class=\"row\">\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "                    <div class=\"col-xs-12\" style=\"border:1px dashed #d3d3d3; border-radius:5px; height:auto; color:#d3d3d3; padding-top:10px; padding-bottom:20px; width:97%; margin-left:12px; margin-bottom:20px;\">\n" +
    "                      <h4>Court Divisions</h4>\n" +
    "                      <input ng-repeat=\"division in divisions\" set-focus=\"$last\" id=\"division\" name=\"division\" type=\"text\" class=\"form-control\" ng-model=\"division.name\" ng-minlength=2 ng-focus required placeholder=\"Name of Division\" ng-keydown = \"addDivision($event)\" ng-style=\"{'margin-bottom':(courts.length == 1)?'0px':'10px'}\"/>\n" +
    "                      <div class=\"text-danger\" ng-show=\"form.$submitted && form.coram.$invalid || form.coram.$dirty && form.coram.$invalid && !form.coram.$focused\">\n" +
    "\n" +
    "                        <span ng-show=\"form.coram.$error.required\">Name of Division is required</span>\n" +
    "                        <span ng-show=\"form.coram.$error.minlength\">Name of Division is required to be at least 2 characters long</span>\n" +
    "\n" +
    "                      </div>\n" +
    "                    </div>\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "                  </div>\n" +
    "\n" +
    "\n" +
    "\n" +
    "            </form>\n" +
    "\n" +
    "   </div>\n" +
    "   <div class=\"modal-footer\" style=\"border-top:none\">\n" +
    "        <button id=\"submit\" type=\"submit\" class=\"btn btn-primary-alt pull-right\"  style=\"width:120px\" ng-click = \"saveCourt()\">Save</button>\n" +
    "\n" +
    "    </div>\n" +
    " </div>\n" +
    "</div>\n" +
    "</div>\n"
  );


  $templateCache.put('templates/defendant-synonym-modal.html',
    "<div id=\"addDefendantSynonymModal\" class=\"modal fade\" style=\"z-index:3000; background-color:rgba(0, 0, 0, 0.5);\">\n" +
    "  <div class=\"modal-dialog\" style=\"width:50%;padding-left: 2%;padding-right: 2%; \">\n" +
    "    <div class=\"modal-content\" style=\"margin-top: 8%\">\n" +
    "      <div class=\"modal-header\" style=\"border-bottom:none\">\n" +
    "          <button type=\"button\" id=\"closeModal\" class=\"close\" data-dismiss=\"modal\" aria-hidden=\"true\">&times;</button>\n" +
    "\n" +
    "        <h4 style=\"font-weight: 100;\"><span id=\"CustomerHeading\">&nbsp&nbspAdd Synonym</span></h4>\n" +
    "        <p id=\"WelcomeMessage\" style=\"margin-left:12px\">\n" +
    "          Please ensure that you fill in all the mandatory sections in the form.\n" +
    "        </p>\n" +
    "      </div>\n" +
    "\n" +
    "      <div class=\"modal-body\" style=\"margin-bottom: none; padding-top: 0px; border-bottom:none\">\n" +
    "\n" +
    "        <!-- Start Form-->\n" +
    "\n" +
    "              <form id =\"applicationForm\" name=\"form\" class=\"css-form\" novalidate>\n" +
    "                  <div class=\"row\">\n" +
    "\n" +
    "\n" +
    "                    <div class=\"col-xs-12 form-group\">\n" +
    "                      <input id=\"location-name\" name=\"location-name\" type=\"text\" class=\"form-control\" ng-model=\"defendantSynonym.synonym\" ng-minlength=2 ng-focus required placeholder=\"Synonym\"/>\n" +
    "                      <div class=\"text-danger\" ng-show=\"form.$submitted && form.location-name.$invalid || form.location-name.$dirty && form.location-name.$invalid && !form.location-name.$focused\">\n" +
    "\n" +
    "                        <span ng-show=\"form.location-name.$error.required\">Synonym is required</span>\n" +
    "                        <span ng-show=\"form.location-name.$error.minlength\">Synonym is required to be at least 2 characters long</span>\n" +
    "\n" +
    "                      </div>\n" +
    "                    </div>\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "                  </div>\n" +
    "\n" +
    "                  <div class = \"form-group\">\n" +
    "                    <button id=\"submit\" type=\"submit\" class=\"btn btn-primary-alt pull-right\"  style=\"width:120px\" ng-click = \"saveDefendantSynonym()\">Save</button>\n" +
    "\n" +
    "\n" +
    "                    <div id=\"submitAppMsg\" class=\"pull-left\" style=\"font-size: larger; position: relative; top: 5px\"></div>\n" +
    "                  </div>\n" +
    "\n" +
    "            </form>\n" +
    "\n" +
    "   </div>\n" +
    "   <div class=\"modal-footer\" style=\"border-top:none\">\n" +
    "\n" +
    "\n" +
    "    </div>\n" +
    " </div>\n" +
    "</div>\n" +
    "</div>\n"
  );


  $templateCache.put('templates/jurisdiction-modal.html',
    "<div id=\"addJurisdictionModal\" class=\"modal fade\" style=\"z-index:3000; background-color:rgba(0, 0, 0, 0.5);\">\n" +
    "  <div class=\"modal-dialog\" style=\"width:50%;padding-left: 2%;padding-right: 2%; \">\n" +
    "    <div class=\"modal-content\" style=\"margin-top: 8%\">\n" +
    "      <div class=\"modal-header\" style=\"border-bottom:none\">\n" +
    "          <button type=\"button\" id=\"closeModal\" class=\"close\" data-dismiss=\"modal\" aria-hidden=\"true\">&times;</button>\n" +
    "\n" +
    "        <h4 style=\"font-weight: 100;\"><span id=\"CustomerHeading\">&nbsp&nbspAdd Jurisdiction</span></h4>\n" +
    "        <p id=\"WelcomeMessage\" style=\"margin-left:12px\">\n" +
    "          Please ensure that you fill in all the mandatory sections in the form.\n" +
    "        </p>\n" +
    "      </div>\n" +
    "\n" +
    "      <div class=\"modal-body\" style=\"margin-bottom: none; padding-top: 0px; border-bottom:none\">\n" +
    "\n" +
    "        <!-- Start Form-->\n" +
    "\n" +
    "              <form id =\"applicationForm\" name=\"form\" class=\"css-form\" novalidate>\n" +
    "                  <div class=\"row\">\n" +
    "\n" +
    "\n" +
    "                    <div class=\"col-xs-12 form-group\">\n" +
    "                      <input id=\"jurisdiction-name\" name=\"jurisdiction-name\" type=\"text\" class=\"form-control\" ng-model=\"jurisdiction.name\" ng-minlength=2 ng-focus required placeholder=\"Name of Jurisdiction\"/>\n" +
    "                      <div class=\"text-danger\" ng-show=\"form.$submitted && form.jurisdiction-name.$invalid || form.jurisdiction-name.$dirty && form.jurisdiction-name.$invalid && !form.jurisdiction-name.$focused\">\n" +
    "\n" +
    "                        <span ng-show=\"form.jurisdiction-name.$error.required\">Name of Jurisdiction is required</span>\n" +
    "                        <span ng-show=\"form.jurisdiction-name.$error.minlength\">Name of Jurisdiction is required to be at least 2 characters long</span>\n" +
    "\n" +
    "                      </div>\n" +
    "                    </div>\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "                  </div>\n" +
    "\n" +
    "                  <div class = \"form-group\">\n" +
    "                    <button id=\"submit\" type=\"submit\" class=\"btn btn-primary-alt pull-right\"  style=\"width:120px\" ng-click = \"saveJurisdiction()\">Save</button>\n" +
    "\n" +
    "\n" +
    "                    <div id=\"submitAppMsg\" class=\"pull-left\" style=\"font-size: larger; position: relative; top: 5px\"></div>\n" +
    "                  </div>\n" +
    "\n" +
    "            </form>\n" +
    "\n" +
    "   </div>\n" +
    "   <div class=\"modal-footer\" style=\"border-top:none\">\n" +
    "\n" +
    "\n" +
    "    </div>\n" +
    " </div>\n" +
    "</div>\n" +
    "</div>\n"
  );


  $templateCache.put('templates/legislation-modal.html',
    "<div id=\"addLegislationModal\" class=\"modal fade\" style=\"z-index:3000; background-color:rgba(0, 0, 0, 0.5);\">\n" +
    "  <div class=\"modal-dialog\" style=\"width:60%;padding-left: 2%;padding-right: 2%; \">\n" +
    "    <div class=\"modal-content\" style=\"margin-top: 8%\">\n" +
    "      <div class=\"modal-header\" style=\"margin-bottom:20px\">\n" +
    "          <button type=\"button\" id=\"closeModal\" class=\"close\" data-dismiss=\"modal\" aria-hidden=\"true\">&times;</button>\n" +
    "\n" +
    "        <h4 style=\"font-weight: 100;\"><span id=\"CustomerHeading\">&nbsp&nbspAdd Legislation</span></h4>\n" +
    "        <p id=\"WelcomeMessage\" style=\"margin-left:8px; margin-top:-10px\">\n" +
    "          Please ensure that you fill in all the mandatory sections (marked with an asterisk, *) in the form.\n" +
    "        </p>\n" +
    "      </div>\n" +
    "\n" +
    "      <div class=\"modal-body\" style=\"margin-bottom: none; padding-top: 0px; border-bottom:none\">\n" +
    "\n" +
    "        <!-- Start Form-->\n" +
    "\n" +
    "              <form id =\"applicationForm\" name=\"form\" class=\"css-form\" ng-submit=\"saveApplication()\" novalidate>\n" +
    "                  <div class=\"row\">\n" +
    "\n" +
    "\n" +
    "\n" +
    "                    <div class=\"col-xs-12 col-md-6 form-group\">\n" +
    "                      <div class=\"btn-group\" data-dropdown style=\"width:100%\">\n" +
    "              \t\t      <button type=\"button\" class=\"btn btn-default-alt dropdown-toggle alt-border\" id=\"typeSelector\" style=\"width:100%; text-align:left\">\n" +
    "              \t\t        <span ng-if=\"!selected\">Select Legislation Type - Act, SI, Schedule or Add *</span><span ng-if=\"selected\">Legislation Type:&nbsp;{{selectedType}}</span>  &nbsp;\n" +
    "              \t\t        <i class=\"fa fa-caret-down pull-right\"></i>\n" +
    "              \t\t      </button>\n" +
    "              \t\t      <ul class=\"dropdown-menu\" role=\"menu\" style=\"text-align: left; left:0; right:0\">\n" +
    "              \t\t         <li ng-repeat=\"type in legislationTypes\"><a class=\"dropdown-toggle\" ng-click=\"typeSelected(type)\">{{type.name}}</a></li>\n" +
    "\n" +
    "              \t\t      </ul>\n" +
    "              \t\t    </div>\n" +
    "                    </div>\n" +
    "\n" +
    "                    <div class=\"col-xs-12 col-md-6 form-group\">\n" +
    "                      <input id=\"legislation-number\" name=\"legislation-number\" type=\"text\" class=\"form-control\" ng-model=\"legislation.legislationNumber\" ng-minlength=2 ng-focus required placeholder=\"Legislation Number *\"/>\n" +
    "                      <div class=\"text-danger\" ng-show=\"form.$submitted && form.legislation-number.$invalid || form.legislation-number.$dirty && form.legislation-number.$invalid && !form.legislation-number.$focused\">\n" +
    "\n" +
    "                        <span ng-show=\"form.legislation-number.$error.required\">Legislation Number is required</span>\n" +
    "                        <span ng-show=\"form.legislation-number.$error.minlength\">Legislation Number is required to be at least 2 characters long</span>\n" +
    "\n" +
    "                      </div>\n" +
    "                    </div>\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "                  </div>\n" +
    "                  <div class=\"row\">\n" +
    "\n" +
    "\n" +
    "\n" +
    "                    <div class=\"col-xs-12 col-md-12 form-group\">\n" +
    "                      <input id=\"legislation-name\" name=\"legislation-name\" type=\"text\" class=\"form-control\" ng-model=\"legislation.legislationName\" ng-minlength=2 ng-focus required placeholder=\"Name *\"/>\n" +
    "                      <div class=\"text-danger\" ng-show=\"form.$submitted && form.legislation-name.$invalid || form.legislation-name.$dirty && form.legislation-name.$invalid && !form.legislation-name.$focused\">\n" +
    "\n" +
    "                        <span ng-show=\"form.legislation-name.$error.required\">Name of Legislation is required</span>\n" +
    "                        <span ng-show=\"form.legislation-name.$error.minlength\">Name of Legislation is required to be at least 2 characters long</span>\n" +
    "\n" +
    "                      </div>\n" +
    "                    </div>\n" +
    "\n" +
    "\n" +
    "                    <div class=\"col-xs-12 col-md-12 form-group\">\n" +
    "                        <textarea id=\"preamble\" name=\"preamble\" type=\"text\" style=\"height: 90px\" min-word-count=\"2\"  class=\"form-control\" ng-model=\"legislation.preamble\"  ng-minlength=2 required ng-focus placeholder=\"Preamble *\"/>\n" +
    "                        <div class=\"text-danger\" ng-show=\"form.$submitted && form.preamble.$invalid || form.preamble.$dirty && form.preamble.$invalid && !form.preamble.$focused\">\n" +
    "\n" +
    "                        <span ng-show=\"form.preamble.$error.required\">Preamble is required</span>\n" +
    "                        <span ng-show=\"form.preamble.$error.minlength\">Preamble is required to be at least 2 characters long</span>\n" +
    "\n" +
    "                      </div>\n" +
    "                    </div>\n" +
    "\n" +
    "\n" +
    "\n" +
    "                  </div>\n" +
    "\n" +
    "                  <div class=\"row\">\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "                    <div class=\"col-xs-12 col-md-9 form-group\">\n" +
    "                      <input id=\"dateOfAssent\" name=\"dateOfAssent\" type=\"text\" datetime=\"d MMMM, yyyy\" class=\"form-control\" ng-model=\"legislation.dateOfAssent\" required placeholder=\"Date of Assent\" ng-focus/>\n" +
    "                      <div class=\"text-danger\" ng-show=\"form.$submitted && form.dateOfAssent.$invalid || form.dateOfAssent.$dirty && form.dateOfAssent.$invalid && !form.dateOfAssent.$focused\">\n" +
    "\n" +
    "                        <span ng-show=\"form.dateOfAssent.$error.required\">Date of Assent is required</span>\n" +
    "                        <span ng-show=\"form.dateOfAssent.$error.minlength\">Date of Assent is required to be at least 2 characters long</span>\n" +
    "\n" +
    "                      </div>\n" +
    "                    </div>\n" +
    "\n" +
    "\n" +
    "                    <div class=\"col-xs-12 col-md-3 form-group\">\n" +
    "                      <input id=\"amendment-year\" name=\"amendment-year\" type=\"number\" class=\"form-control\" ng-model=\"legislation.yearOfAmendment\" ng-minlength=2 ng-focus required placeholder=\"Year of Ammendment\"/>\n" +
    "                      <div class=\"text-danger\" ng-show=\"form.$submitted && form.amendment-year.$invalid || form.amendment-year.$dirty && form.amendment-year.$invalid && !form.amendment-year.$focused\">\n" +
    "\n" +
    "                        <span ng-show=\"form.amendment-year.$error.required\">Year of Ammendment is required</span>\n" +
    "                        <span ng-show=\"form.amendment-year.$error.minlength\">Year of Ammendment is required to be at least 2 characters long</span>\n" +
    "\n" +
    "                      </div>\n" +
    "                    </div>\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "                  </div>\n" +
    "\n" +
    "                  <div class=\"row\">\n" +
    "                    <div class=\"col-xs-12 col-md-4 form-group\">\n" +
    "                      <input id=\"enactment\" name=\"enactment\" type=\"text\" class=\"form-control\" ng-model=\"legislation.enactment\" ng-minlength=2 ng-focus required placeholder=\"Enactment *\"/>\n" +
    "                      <div class=\"text-danger\" ng-show=\"form.$submitted && form.enactment.$invalid || form.enactment.$dirty && form.enactment.$invalid && !form.enactment.$focused\">\n" +
    "\n" +
    "                        <span ng-show=\"form.enactment.$error.required\">Enactment is required</span>\n" +
    "                        <span ng-show=\"form.enactment.$error.minlength\">Enactment is required to be at least 2 characters long</span>\n" +
    "\n" +
    "                      </div>\n" +
    "                    </div>\n" +
    "\n" +
    "                    <div class=\"col-xs-12 col-md-4 form-group\">\n" +
    "                      <input id=\"volumeNumber\" name=\"volumeNumber\" type=\"text\" class=\"form-control\" ng-model=\"legislation.volumeNumber\" ng-minlength=2 ng-focus required placeholder=\"Volume Number\"/>\n" +
    "                      <div class=\"text-danger\" ng-show=\"form.$submitted && form.volumeNumber.$invalid || form.volumeNumber.$dirty && form.volumeNumber.$invalid && !form.volumeNumber.$focused\">\n" +
    "\n" +
    "                        <span ng-show=\"form.volumeNumber.$error.required\">Volume Number is required</span>\n" +
    "                        <span ng-show=\"form.volumeNumber.$error.minlength\">Volume Number is required to be at least 2 characters long</span>\n" +
    "\n" +
    "                      </div>\n" +
    "                    </div>\n" +
    "\n" +
    "\n" +
    "                    <div class=\"col-xs-12 col-md-4 form-group\">\n" +
    "                      <input id=\"chapter-number\" name=\"chapter-number\" type=\"text\" class=\"form-control\" ng-model=\"legislation.chapterNumber\" ng-minlength=2 ng-focus required placeholder=\"Chapter Number\"/>\n" +
    "                      <div class=\"text-danger\" ng-show=\"form.$submitted && form.chapter-number.$invalid || form.chapter-number.$dirty && form.chapter-number.$invalid && !form.chapter-number.$focused\">\n" +
    "\n" +
    "                        <span ng-show=\"form.chapter-number.$error.required\">Chapter Number is required</span>\n" +
    "                        <span ng-show=\"form.chapter-number.$error.minlength\">Chapter Number is required to be at least 2 characters long</span>\n" +
    "\n" +
    "                      </div>\n" +
    "                    </div>\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "                  </div>\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "                  <div class=\"row\">\n" +
    "\n" +
    "                    <div class=\"col-xs-12\" ng-style = \"{'text-align':(legislationParts.length == 0)?'center':'left'}\" style=\"border:1px dashed #d3d3d3; border-radius:5px; height:auto; color:#d3d3d3; padding-top:20px; padding-bottom:60px; width:97%; margin-left:12px\">\n" +
    "                        <br/>\n" +
    "                        <div class=\"row\">\n" +
    "                          <div class=\"col-xs-12\" ng-repeat=\"part in legislationParts\" style=\"margin-top:5px\">\n" +
    "                              <ng-include src=\"'templates/legislation-part-form.html'\"></ng-include>\n" +
    "\n" +
    "                          </div>\n" +
    "\n" +
    "                          <div class=\"col-xs-1 pull-right\">\n" +
    "                            <a ng-click=\"addLegislationPart()\"><i style=\"font-size:2em; z-index:10000\"  class=\"fa fa-plus\"></i></a>\n" +
    "                          </div>\n" +
    "\n" +
    "                        </div>\n" +
    "\n" +
    "\n" +
    "\n" +
    "                        <span ng-show=\"legislationParts.length == 0\" style=\"font-size:1.5em; font-weight:100\">Add Legislation Parts</span>\n" +
    "                        <div ng-if=\"!showParts\" style=\"position: relative; left: 50%; margin-left: -100px; height: 50px; margin-top: 40px\"><i ng-if=\"!parts_returned\" class='fa fa-fw fa-sun-o fa-spin'></i> Loading. Please Wait...</div>\n" +
    "\n" +
    "                    </div>\n" +
    "\n" +
    "\n" +
    "\n" +
    "                  </div>\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "                  <div class = \"form-group\">\n" +
    "\n" +
    "\n" +
    "\n" +
    "                    <div id=\"submitAppMsg\" class=\"pull-left\" style=\"font-size: larger; position: relative; top: 5px\"></div>\n" +
    "                  </div>\n" +
    "\n" +
    "            </form>\n" +
    "\n" +
    "   </div>\n" +
    "   <div class=\"modal-footer\" style=\"\">\n" +
    "      <button id=\"submit\" ng-click=\"saveLegislation()\" type=\"submit\" class=\"btn btn-primary-alt pull-right\"  style=\"width:120px\">Save Legislation</button>\n" +
    "\n" +
    "    </div>\n" +
    " </div>\n" +
    "</div>\n" +
    "<ng-include src=\"'templates/legislation-part-modal.html'\"></ng-include>\n" +
    "</div>\n" +
    "\n" +
    "\n" +
    "<ng-include src=\"'templates/legislation-type-modal.html'\"></ng-include>\n"
  );


  $templateCache.put('templates/legislation-part-form.html',
    "<h3>{{part.title}}</h3>\n" +
    "\n" +
    "<form id =\"applicationForm\" name=\"form\" class=\"css-form\" novalidate>\n" +
    "    <div class=\"row\">\n" +
    "\n" +
    "      <div class=\"col-xs-12 col-md-3 form-group\">\n" +
    "        <select class=\"form-control\" ng-model = \"part.partType\" ng-options=\"type.name for type in legislationPartTypes track by type.id\" id=\"partType\">\n" +
    "            <!--option value=\"\" disabled selected>\n" +
    "              <span style=\"font-weight:600\">Select Part Type...</span>\n" +
    "            </option>\n" +
    "            <option ng-repeat=\"type in legislationPartTypes\" value=\"{{type.id}}\">\n" +
    "              {{type.name}}\n" +
    "            </option-->\n" +
    "            <option value=\"\">- Please Select Part Type -</option>\n" +
    "        </select>\n" +
    "      </div>\n" +
    "\n" +
    "      <div class=\"col-xs-12 col-md-9 form-group\">\n" +
    "        <input id=\"court-name\" name=\"court-name\" type=\"text\" class=\"form-control\" ng-model=\"part.title\" ng-minlength=2 ng-focus required placeholder=\"Title\"/>\n" +
    "        <div class=\"text-danger\" ng-show=\"form.$submitted && form.court-name.$invalid || form.court-name.$dirty && form.court-name.$invalid && !form.court-name.$focused\">\n" +
    "\n" +
    "          <span ng-show=\"form.court-name.$error.required\">Title is required</span>\n" +
    "          <span ng-show=\"form.court-name.$error.minlength\">Title is required to be at least 2 characters long</span>\n" +
    "\n" +
    "        </div>\n" +
    "      </div>\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "      <div class=\"col-xs-12 col-md-12 form-group\">\n" +
    "          <textarea id=\"preamble\" name=\"preamble\" type=\"text\" style=\"height: 90px; width:100%\"; min-word-count=\"2\"  class=\"form-control\" ng-model=\"part.content\"  ng-minlength=2 required ng-focus placeholder=\"Content *\"/>\n" +
    "          <div class=\"text-danger\" ng-show=\"form.$submitted && form.preamble.$invalid || form.preamble.$dirty && form.preamble.$invalid && !form.preamble.$focused\">\n" +
    "\n" +
    "          <span ng-show=\"form.preamble.$error.required\">Content is required</span>\n" +
    "          <span ng-show=\"form.preamble.$error.minlength\">Content is required to be at least 2 characters long</span>\n" +
    "\n" +
    "        </div>\n" +
    "      </div>\n" +
    "\n" +
    "      <div class=\"col-xs-12 col-md-12 form-group\" ng-if=\"legislationParts.length > 1\">\n" +
    "        <select id=\"court\" ui-select2=\"{minimumInputLength: 2, width: 'resolve'}\" ng-model=\"part.parentPart\"  onchange=\"showCustomerDetails()\" style=\"font-weight: 700; width:100%; position: relative; vertical-align: middle; background-color: white\" class=\"ng-pristine ng-valid select2-offscreen\" tabindex=\"-1\" title=\"\" placeholder = \"Parent Part\" >\n" +
    "          <option ng-repeat=\"legislationPart in legislationParts\" value=\"{{legislationPart.id}}\" disabled>\n" +
    "            Select Parent...\n" +
    "          </option>\n" +
    "            <option ng-repeat=\"legislationPart in legislationParts\" value=\"{{legislationPart.id}}\">\n" +
    "              {{legislationPart.title + \": \" + legislationPart.content}}\n" +
    "            </option>\n" +
    "        </select>\n" +
    "      </div>\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "    </div>\n" +
    "\n" +
    "\n" +
    "\n" +
    "</form>\n"
  );


  $templateCache.put('templates/legislation-part-modal.html',
    "<div id=\"addLegislationPart\" class=\"modal fade\" style=\"z-index:3000; background-color:rgba(0, 0, 0, 0.5);\">\n" +
    "  <div class=\"modal-dialog\" style=\"width:50%;padding-left: 2%;padding-right: 2%; \">\n" +
    "    <div class=\"modal-content\" style=\"margin-top: 8%\">\n" +
    "      <div class=\"modal-header\" style=\"border-bottom:none\">\n" +
    "          <button type=\"button\" id=\"closeModal\" class=\"close\" data-dismiss=\"modal\" aria-hidden=\"true\">&times;</button>\n" +
    "\n" +
    "        <h4 style=\"font-weight: 100;\"><span id=\"CustomerHeading\">&nbsp&nbspAdd Legislation Part</span></h4>\n" +
    "        <p id=\"WelcomeMessage\" style=\"margin-left:12px\">\n" +
    "          Please ensure that you fill in all the mandatory sections in the form.\n" +
    "        </p>\n" +
    "      </div>\n" +
    "\n" +
    "      <div class=\"modal-body\" style=\"margin-bottom: none; padding-top: 0px; border-bottom:none\">\n" +
    "\n" +
    "        <!-- Start Form-->\n" +
    "        <form id =\"applicationForm\" name=\"form\" class=\"css-form\"  novalidate>\n" +
    "            <div class=\"row\">\n" +
    "\n" +
    "              <div class=\"col-xs-12 col-md-6 form-group\">\n" +
    "                <div class=\"btn-group\" data-dropdown>\n" +
    "                  <button type=\"button\" class=\"btn btn-default-alt dropdown-toggle alt-border\" id=\"typeSelector\">\n" +
    "                    <span ng-if=\"!partTypeSelected\">Select Part Type</span><span ng-if=\"partTypeSelected\">Part Type:&nbsp;{{selectedPartType}}</span>  &nbsp;\n" +
    "                    <i class=\"fa fa-caret-down\"></i>\n" +
    "                  </button>\n" +
    "                  <ul class=\"dropdown-menu\" role=\"menu\" style=\"text-align: left; left:0; right:0\">\n" +
    "                     <li ng-repeat=\"partType in legislationPartTypes\"><a class=\"dropdown-toggle\" ng-click=\"selectPartType(partType)\">{{partType.name}}</a></li>\n" +
    "                     <li><a a class=\"dropdown-toggle\" data-toggle=\"modal\" data-target=\"#addLegislationTypeModal\"><i class=\"fa fa-plus\"></i>&nbsp;Add Part Type</a></li>\n" +
    "                  </ul>\n" +
    "                </div>\n" +
    "              </div>\n" +
    "\n" +
    "\n" +
    "              <div class=\"col-xs-12 form-group\">\n" +
    "                <input id=\"court-name\" name=\"court-name\" type=\"text\" class=\"form-control\" ng-model=\"legislationPart.title\" ng-minlength=2 ng-focus required placeholder=\"Title\"/>\n" +
    "                <div class=\"text-danger\" ng-show=\"form.$submitted && form.court-name.$invalid || form.court-name.$dirty && form.court-name.$invalid && !form.court-name.$focused\">\n" +
    "\n" +
    "                  <span ng-show=\"form.court-name.$error.required\">Title is required</span>\n" +
    "                  <span ng-show=\"form.court-name.$error.minlength\">Title is required to be at least 2 characters long</span>\n" +
    "\n" +
    "                </div>\n" +
    "              </div>\n" +
    "\n" +
    "              <div class=\"col-xs-12 col-md-12 form-group\">\n" +
    "                  <textarea id=\"preamble\" name=\"preamble\" type=\"text\" style=\"height: 220px; width:100%\"; min-word-count=\"2\"  class=\"form-control\" ng-model=\"legislationPart.content\"  ng-minlength=2 required ng-focus placeholder=\"Content\"/>\n" +
    "                  <div class=\"text-danger\" ng-show=\"form.$submitted && form.preamble.$invalid || form.preamble.$dirty && form.preamble.$invalid && !form.preamble.$focused\">\n" +
    "\n" +
    "                  <span ng-show=\"form.preamble.$error.required\">Content is required</span>\n" +
    "                  <span ng-show=\"form.preamble.$error.minlength\">Content is required to be at least 2 characters long</span>\n" +
    "\n" +
    "                </div>\n" +
    "              </div>\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "              <div class=\"col-xs-6 form-group\">\n" +
    "                <span id=\"sectionHeading\" style=\"margin-bottom:20px\">Parent Part</span>\n" +
    "                <select id=\"court\" ui-select2=\"{minimumInputLength: 2, width: 'resolve'}\" ng-model=\"legislationPart.parentPart\"  onchange=\"showCustomerDetails()\" style=\"font-weight: 700; width:100%; position: relative; vertical-align: middle; background-color: white\" class=\"ng-pristine ng-valid select2-offscreen\" tabindex=\"-1\" title=\"\" >\n" +
    "\n" +
    "                </select>\n" +
    "              </div>\n" +
    "\n" +
    "              <div class=\"col-xs-6 form-group\">\n" +
    "                <span id=\"sectionHeading\" style=\"margin-bottom:20px\">Legislation</span>\n" +
    "                <select id=\"court\" ui-select2=\"{minimumInputLength: 2, width: 'resolve'}\" ng-model=\"legislationPart.legislation\"  onchange=\"showCustomerDetails()\" style=\"font-weight: 700; width:100%; position: relative; vertical-align: middle; background-color: white\" class=\"ng-pristine ng-valid select2-offscreen\" tabindex=\"-1\" title=\"\" >\n" +
    "\n" +
    "                </select>\n" +
    "              </div>\n" +
    "\n" +
    "\n" +
    "\n" +
    "            </div>\n" +
    "\n" +
    "            <div class = \"form-group\">\n" +
    "              <button id=\"submit\" type=\"submit\" class=\"btn btn-primary-alt pull-right\" ng-click=\"addLegislationPart()\" style=\"width:120px\">Add Part</button>\n" +
    "\n" +
    "\n" +
    "              <div id=\"submitAppMsg\" class=\"pull-left\" style=\"font-size: larger; position: relative; top: 5px\"></div>\n" +
    "            </div>\n" +
    "\n" +
    "        </form>\n" +
    "\n" +
    "\n" +
    "\n" +
    "      </div>\n" +
    "   <div class=\"modal-footer\" style=\"border-top:none\">\n" +
    "\n" +
    "\n" +
    "    </div>\n" +
    " </div>\n" +
    "</div>\n" +
    "</div>\n"
  );


  $templateCache.put('templates/legislation-part-type-modal.html',
    "<div id=\"addLegislationPartType\" class=\"modal fade\" style=\"z-index:3000; background-color:rgba(0, 0, 0, 0.5);\">\n" +
    "  <div class=\"modal-dialog\" style=\"width:50%;padding-left: 2%;padding-right: 2%; \">\n" +
    "    <div class=\"modal-content\" style=\"margin-top: 8%\">\n" +
    "      <div class=\"modal-header\" style=\"border-bottom:none\">\n" +
    "          <button type=\"button\" id=\"closeModal\" class=\"close\" data-dismiss=\"modal\" aria-hidden=\"true\">&times;</button>\n" +
    "\n" +
    "        <h4 style=\"font-weight: 100;\"><span id=\"CustomerHeading\">&nbsp&nbspAdd Legislation Part Type</span></h4>\n" +
    "        <p id=\"WelcomeMessage\" style=\"margin-left:12px\">\n" +
    "          Please ensure that you fill in all the mandatory sections in the form.\n" +
    "        </p>\n" +
    "      </div>\n" +
    "\n" +
    "      <div class=\"modal-body\" style=\"margin-bottom: none; padding-top: 0px; border-bottom:none\">\n" +
    "\n" +
    "        <!-- Start Form-->\n" +
    "\n" +
    "              <form id =\"applicationForm\" name=\"form\" class=\"css-form\" ng-submit=\"saveApplication()\" novalidate>\n" +
    "                  <div class=\"row\">\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "                    <div class=\"col-xs-12 form-group\">\n" +
    "                      <input id=\"court-name\" name=\"court-name\" type=\"text\" class=\"form-control\" ng-model=\"legislationPartType.name\" ng-minlength=2 ng-focus required placeholder=\"Name\"/>\n" +
    "                      <div class=\"text-danger\" ng-show=\"form.$submitted && form.court-name.$invalid || form.court-name.$dirty && form.court-name.$invalid && !form.court-name.$focused\">\n" +
    "\n" +
    "                        <span ng-show=\"form.court-name.$error.required\">Name is required</span>\n" +
    "                        <span ng-show=\"form.court-name.$error.minlength\">Name is required to be at least 2 characters long</span>\n" +
    "\n" +
    "                      </div>\n" +
    "                    </div>\n" +
    "\n" +
    "\n" +
    "                  </div>\n" +
    "\n" +
    "                  <div class = \"form-group\">\n" +
    "                    <button id=\"submit\" type=\"submit\" class=\"btn btn-primary-alt pull-right\"  style=\"width:120px\" ng-click = \"saveLegislationPartType()\">Save</button>\n" +
    "\n" +
    "\n" +
    "                    <div id=\"submitAppMsg\" class=\"pull-left\" style=\"font-size: larger; position: relative; top: 5px\"></div>\n" +
    "                  </div>\n" +
    "\n" +
    "            </form>\n" +
    "\n" +
    "   </div>\n" +
    "   <div class=\"modal-footer\" style=\"border-top:none\">\n" +
    "\n" +
    "\n" +
    "    </div>\n" +
    " </div>\n" +
    "</div>\n" +
    "</div>\n"
  );


  $templateCache.put('templates/legislation-type-modal.html',
    "<div id=\"addLegislationTypeModal\" class=\"modal fade\" style=\"z-index:3000; background-color:rgba(0, 0, 0, 0.5);\">\n" +
    "  <div class=\"modal-dialog\" style=\"width:50%;padding-left: 2%;padding-right: 2%; \">\n" +
    "    <div class=\"modal-content\" style=\"margin-top: 8%\">\n" +
    "      <div class=\"modal-header\" style=\"border-bottom:none\">\n" +
    "          <button type=\"button\" id=\"closeModal\" class=\"close\" data-dismiss=\"modal\" aria-hidden=\"true\">&times;</button>\n" +
    "\n" +
    "        <h4 style=\"font-weight: 100;\"><span id=\"CustomerHeading\">&nbsp&nbspAdd Legislation Type</span></h4>\n" +
    "        <p id=\"WelcomeMessage\" style=\"margin-left:12px\">\n" +
    "          Please ensure that you fill in all the mandatory sections in the form.\n" +
    "        </p>\n" +
    "      </div>\n" +
    "\n" +
    "      <div class=\"modal-body\" style=\"margin-bottom: none; padding-top: 0px; border-bottom:none\">\n" +
    "\n" +
    "        <!-- Start Form-->\n" +
    "\n" +
    "              <form id =\"applicationForm\" name=\"form\" class=\"css-form\" ng-submit=\"saveApplication()\" novalidate>\n" +
    "                  <div class=\"row\">\n" +
    "\n" +
    "\n" +
    "                    <div class=\"col-xs-12 form-group\">\n" +
    "                      <input id=\"type-name\" name=\"type-name\" type=\"text\" class=\"form-control\" ng-model=\"legislationType.name\" ng-minlength=2 ng-focus required placeholder=\"Name\"/>\n" +
    "                      <div class=\"text-danger\" ng-show=\"form.$submitted && form.name.$invalid || form.name.$dirty && form.name.$invalid && !form.name.$focused\">\n" +
    "\n" +
    "                        <span ng-show=\"form.name.$error.required\">Name is required</span>\n" +
    "                        <span ng-show=\"form.name.$error.minlength\">Name is required to be at least 2 characters long</span>\n" +
    "\n" +
    "                      </div>\n" +
    "                    </div>\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "                  </div>\n" +
    "\n" +
    "                  <div class = \"form-group\">\n" +
    "\n" +
    "\n" +
    "\n" +
    "                    <div id=\"submitAppMsg\" class=\"pull-left\" style=\"font-size: larger; position: relative; top: 5px\"></div>\n" +
    "                  </div>\n" +
    "\n" +
    "            </form>\n" +
    "\n" +
    "   </div>\n" +
    "   <div class=\"modal-footer\" style=\"\">\n" +
    "        <button id=\"submit\" type=\"submit\" class=\"btn btn-primary-alt pull-right\"  ng-click=\"saveLegislationType()\" style=\"width:120px\">Save</button>\n" +
    "\n" +
    "    </div>\n" +
    " </div>\n" +
    "</div>\n" +
    "</div>\n"
  );


  $templateCache.put('templates/location-modal.html',
    "<div id=\"addLocationModal\" class=\"modal fade\" style=\"z-index:3000; background-color:rgba(0, 0, 0, 0.5);\">\n" +
    "  <div class=\"modal-dialog\" style=\"width:50%;padding-left: 2%;padding-right: 2%; \">\n" +
    "    <div class=\"modal-content\" style=\"margin-top: 8%\">\n" +
    "      <div class=\"modal-header\" style=\"border-bottom:none\">\n" +
    "          <button type=\"button\" id=\"closeModal\" class=\"close\" data-dismiss=\"modal\" aria-hidden=\"true\">&times;</button>\n" +
    "\n" +
    "        <h4 style=\"font-weight: 100;\"><span id=\"CustomerHeading\">&nbsp&nbspAdd Location</span></h4>\n" +
    "        <p id=\"WelcomeMessage\" style=\"margin-left:12px\">\n" +
    "          Please ensure that you fill in all the mandatory sections in the form.\n" +
    "        </p>\n" +
    "      </div>\n" +
    "\n" +
    "      <div class=\"modal-body\" style=\"margin-bottom: none; padding-top: 0px; border-bottom:none\">\n" +
    "\n" +
    "        <!-- Start Form-->\n" +
    "\n" +
    "              <form id =\"applicationForm\" name=\"form\" class=\"css-form\" novalidate>\n" +
    "                  <div class=\"row\">\n" +
    "\n" +
    "\n" +
    "                    <div class=\"col-xs-12 form-group\">\n" +
    "                      <input id=\"location-name\" name=\"location-name\" type=\"text\" class=\"form-control\" ng-model=\"location.name\" ng-minlength=2 ng-focus required placeholder=\"Name of Location\"/>\n" +
    "                      <div class=\"text-danger\" ng-show=\"form.$submitted && form.location-name.$invalid || form.location-name.$dirty && form.location-name.$invalid && !form.location-name.$focused\">\n" +
    "\n" +
    "                        <span ng-show=\"form.location-name.$error.required\">Name of Location is required</span>\n" +
    "                        <span ng-show=\"form.location-name.$error.minlength\">Name of Location is required to be at least 2 characters long</span>\n" +
    "\n" +
    "                      </div>\n" +
    "                    </div>\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "                  </div>\n" +
    "\n" +
    "                  <div class = \"form-group\">\n" +
    "                    <button id=\"submit\" type=\"submit\" class=\"btn btn-primary-alt pull-right\"  style=\"width:120px\" ng-click = \"saveLocation()\">Save</button>\n" +
    "\n" +
    "\n" +
    "                    <div id=\"submitAppMsg\" class=\"pull-left\" style=\"font-size: larger; position: relative; top: 5px\"></div>\n" +
    "                  </div>\n" +
    "\n" +
    "            </form>\n" +
    "\n" +
    "   </div>\n" +
    "   <div class=\"modal-footer\" style=\"border-top:none\">\n" +
    "\n" +
    "\n" +
    "    </div>\n" +
    " </div>\n" +
    "</div>\n" +
    "</div>\n"
  );


  $templateCache.put('templates/nav_renderer.html',
    "<a ng-click=\"select(item)\" ng-href=\"{{item.url}}\">\n" +
    "\t<i ng-if=\"item.iconClasses\" class=\"{{item.iconClasses}}\"></i><span>{{item.label}}</span>\n" +
    "\t<span ng-bind-html=\"item.html\"></span>\n" +
    "</a>\n" +
    "<ul ng-if=\"item.children.length\" data-slide-out-nav=\"item.open\">\n" +
    "    <li ng-repeat=\"item in item.children\"\n" +
    "\t    ng-class=\"{ hasChild: (item.children!==undefined),\n" +
    "                      active: item.selected,\n" +
    "                        open: (item.children!==undefined) && item.open }\"\n" +
    "    \tng-include=\"'templates/nav_renderer.html'\"\n" +
    "    ></li>\n" +
    "</ul>\n"
  );


  $templateCache.put('templates/nav_renderer_horizontal.html',
    "<a ng-click=\"select(item)\" ng-href=\"{{item.url}}\">\n" +
    "  <i ng-if=\"item.iconClasses\" class=\"{{item.iconClasses}}\"></i><span>{{item.label}}</span>\n" +
    "  <span ng-bind-html=\"item.html\"></span>\n" +
    "</a>\n" +
    "<ul ng-if=\"item.children.length\">\n" +
    "    <li ng-repeat=\"item in item.children\"\n" +
    "      ng-class=\"{ hasChild: (item.children!==undefined),\n" +
    "                      active: item.selected,\n" +
    "                        open: (item.children!==undefined) && item.open }\"\n" +
    "      ng-include=\"'templates/nav_renderer_horizontal.html'\"\n" +
    "    ></li>\n" +
    "</ul>\n"
  );


  $templateCache.put('templates/panel-tabs-without-heading.html',
    "<div class=\"panel {{panelClass}}\">\n" +
    "  <div class=\"panel-heading\">\n" +
    "        <h4>\n" +
    "            <ul class=\"nav nav-{{type || 'tabs'}}\" ng-class=\"{'nav-stacked': vertical, 'nav-justified': justified}\" ng-transclude></ul>\n" +
    "        </h4>\n" +
    "  </div>\n" +
    "  <div class=\"panel-body\">\n" +
    "    <div class=\"tab-content\">\n" +
    "        <div class=\"tab-pane\"\n" +
    "            ng-repeat=\"tab in tabs\"\n" +
    "            ng-class=\"{active: tab.active}\"\n" +
    "            tab-content-transclude=\"tab\">\n" +
    "        </div>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "</div>\n"
  );


  $templateCache.put('templates/panel-tabs.html',
    "<div class=\"panel {{panelClass}}\">\n" +
    "  <div class=\"panel-heading\">\n" +
    "        <h4><i ng-if=\"panelIcon\" class=\"{{panelIcon}}\"></i>{{(panelIcon? \" \":\"\")+heading}}</h4>\n" +
    "        <div class=\"options\">\n" +
    "            <ul class=\"nav nav-{{type || 'tabs'}}\" ng-class=\"{'nav-stacked': vertical, 'nav-justified': justified}\" ng-transclude></ul>\n" +
    "        </div>\n" +
    "  </div>\n" +
    "  <div class=\"panel-body\">\n" +
    "    <div class=\"tab-content\">\n" +
    "        <div class=\"tab-pane\"\n" +
    "            ng-repeat=\"tab in tabs\"\n" +
    "            ng-class=\"{active: tab.active}\"\n" +
    "            tab-content-transclude=\"tab\">\n" +
    "        </div>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "</div>\n"
  );


  $templateCache.put('templates/panel.html',
    "<div class=\"panel {{panelClass}}\">\n" +
    "  <div class=\"panel-heading\">\n" +
    "        <h4><i ng-if=\"panelIcon\" class=\"{{panelIcon}}\"></i>{{(panelIcon? \" \":\"\")+heading}}</h4>\n" +
    "        <div class=\"options\">\n" +
    "        </div>\n" +
    "  </div>\n" +
    "  <div class=\"panel-body\" ng-transclude>\n" +
    "  </div>\n" +
    "</div>\n"
  );


  $templateCache.put('templates/plaintiff-synonym-modal.html',
    "<div id=\"addPlaintiffSynonymModal\" class=\"modal fade\" style=\"z-index:3000; background-color:rgba(0, 0, 0, 0.5);\">\n" +
    "  <div class=\"modal-dialog\" style=\"width:50%;padding-left: 2%;padding-right: 2%; \">\n" +
    "    <div class=\"modal-content\" style=\"margin-top: 8%\">\n" +
    "      <div class=\"modal-header\" style=\"border-bottom:none\">\n" +
    "          <button type=\"button\" id=\"closeModal\" class=\"close\" data-dismiss=\"modal\" aria-hidden=\"true\">&times;</button>\n" +
    "\n" +
    "        <h4 style=\"font-weight: 100;\"><span id=\"CustomerHeading\">&nbsp&nbspAdd Synonym</span></h4>\n" +
    "        <p id=\"WelcomeMessage\" style=\"margin-left:12px\">\n" +
    "          Please ensure that you fill in all the mandatory sections in the form.\n" +
    "        </p>\n" +
    "      </div>\n" +
    "\n" +
    "      <div class=\"modal-body\" style=\"margin-bottom: none; padding-top: 0px; border-bottom:none\">\n" +
    "\n" +
    "        <!-- Start Form-->\n" +
    "\n" +
    "              <form id =\"applicationForm\" name=\"form\" class=\"css-form\" novalidate>\n" +
    "                  <div class=\"row\">\n" +
    "\n" +
    "\n" +
    "                    <div class=\"col-xs-12 form-group\">\n" +
    "                      <input id=\"synonym\" name=\"synonym\" type=\"text\" class=\"form-control\" ng-model=\"plaintiffSynonym.synonym\" ng-minlength=2 ng-focus required placeholder=\"Synonym\"/>\n" +
    "                      <div class=\"text-danger\" ng-show=\"form.$submitted && form.synonym.$invalid || form.synonym.$dirty && form.synonym.$invalid && !form.synonym.$focused\">\n" +
    "\n" +
    "                        <span ng-show=\"form.synonym.$error.required\">Synonym is required</span>\n" +
    "                        <span ng-show=\"form.synonym.$error.minlength\">Synonym is required to be at least 2 characters long</span>\n" +
    "\n" +
    "                      </div>\n" +
    "                    </div>\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "                  </div>\n" +
    "\n" +
    "                  <div class = \"form-group\">\n" +
    "                    <button id=\"submit\" type=\"submit\" class=\"btn btn-primary-alt pull-right\"  style=\"width:120px\" ng-click = \"savePlaintiffSynonym()\">Save</button>\n" +
    "\n" +
    "\n" +
    "                    <div id=\"submitAppMsg\" class=\"pull-left\" style=\"font-size: larger; position: relative; top: 5px\"></div>\n" +
    "                  </div>\n" +
    "\n" +
    "            </form>\n" +
    "\n" +
    "   </div>\n" +
    "   <div class=\"modal-footer\" style=\"border-top:none\">\n" +
    "\n" +
    "\n" +
    "    </div>\n" +
    " </div>\n" +
    "</div>\n" +
    "</div>\n"
  );


  $templateCache.put('templates/themed-tabs-bottom.html',
    "<div class=\"tab-container tab-{{theme || 'primary'}} tab-{{position || 'normal'}}\">\n" +
    "  <div class=\"tab-content\">\n" +
    "    <div class=\"tab-pane\"\n" +
    "        ng-repeat=\"tab in tabs\"\n" +
    "        ng-class=\"{active: tab.active}\"\n" +
    "        tab-content-transclude=\"tab\">\n" +
    "    </div>\n" +
    "  </div>\n" +
    "  <ul class=\"nav nav-{{type || 'tabs'}}\" ng-class=\"{'nav-stacked': vertical, 'nav-justified': justified}\" ng-transclude></ul>\n" +
    "</div>\n"
  );


  $templateCache.put('templates/themed-tabs.html',
    "<div class=\"tab-container tab-{{theme || 'primary'}} tab-{{position || 'normal'}}\">\n" +
    "  <ul class=\"nav nav-{{type || 'tabs'}}\" ng-class=\"{'nav-stacked': vertical, 'nav-justified': justified}\" ng-transclude></ul>\n" +
    "  <div class=\"tab-content\">\n" +
    "    <div class=\"tab-pane\"\n" +
    "        ng-repeat=\"tab in tabs\"\n" +
    "        ng-class=\"{active: tab.active}\"\n" +
    "        tab-content-transclude=\"tab\">\n" +
    "    </div>\n" +
    "  </div>\n" +
    "</div>\n"
  );


  $templateCache.put('templates/tile-generic.html',
    "<div class=\"info-tiles tiles-{{type}}\">\n" +
    "\t<div class=\"tiles-heading\">\n" +
    "\t\t{{heading}}\n" +
    "\t</div>\n" +
    "\t<div class=\"tiles-body\" ng-transclude>\n" +
    "\t</div>\n" +
    "</div>\n"
  );


  $templateCache.put('templates/tile-large.html',
    "<a class=\"info-tiles tiles-{{item.color}}\" ng-href=\"{{item.href}}\">\n" +
    "    <div class=\"tiles-heading\">\n" +
    "        <div class=\"pull-left\">{{item.title}}</div>\n" +
    "        <div class=\"pull-right\">{{item.titleBarInfo}}</div>\n" +
    "    </div>\n" +
    "    <div class=\"tiles-body\">\n" +
    "        <div class=\"pull-left\"><i class=\"{{item.classes}}\"></i></div>\n" +
    "        <div class=\"pull-right\" ng-show=\"item.text\">{{item.text}}</div>\n" +
    "        <div class=\"pull-right\" ng-show=\"!item.text\" ng-transclude></div>\n" +
    "    </div>\n" +
    "</a>\n"
  );


  $templateCache.put('templates/tile-mini.html',
    "<a class=\"shortcut-tiles tiles-{{item.color}}\" ng-href=\"{{item.href}}\">\n" +
    "\t<div class=\"tiles-body\">\n" +
    "\t\t<div class=\"pull-left\"><i class=\"{{item.classes}}\"></i></div>\n" +
    "\t\t<div class=\"pull-right\"><span class=\"badge\">{{item.titleBarInfo}}</span></div>\n" +
    "\t</div>\n" +
    "\t<div class=\"tiles-footer\">\n" +
    "\t\t{{item.text}}\n" +
    "\t</div>\n" +
    "</a>\n"
  );


  $templateCache.put('templates/work-modal.html',
    "<div id=\"addWorkModal\" class=\"modal fade\" style=\"z-index:3000; background-color:rgba(0, 0, 0, 0.5);\">\n" +
    "  <div class=\"modal-dialog\" style=\"width:50%;padding-left: 2%;padding-right: 2%; \">\n" +
    "    <div class=\"modal-content\" style=\"margin-top: 8%\">\n" +
    "      <div class=\"modal-header\" style=\"border-bottom:none\">\n" +
    "          <button type=\"button\" id=\"closeModal\" class=\"close\" data-dismiss=\"modal\" aria-hidden=\"true\">&times;</button>\n" +
    "\n" +
    "        <h4 style=\"font-weight: 100;\"><span id=\"CustomerHeading\">&nbsp&nbspAdd Work</span></h4>\n" +
    "        <p id=\"WelcomeMessage\" style=\"margin-left:12px\">\n" +
    "          Please ensure that you fill in all the mandatory sections in the form.\n" +
    "        </p>\n" +
    "      </div>\n" +
    "\n" +
    "      <div class=\"modal-body\" style=\"margin-bottom: none; padding-top: 0px; border-bottom:none\">\n" +
    "\n" +
    "        <!-- Start Form-->\n" +
    "\n" +
    "              <form id =\"applicationForm\" name=\"form\" class=\"css-form\" novalidate>\n" +
    "                  <div class=\"row\">\n" +
    "\n" +
    "\n" +
    "                    <div class=\"col-xs-12 form-group\">\n" +
    "                      <input id=\"work-name\" name=\"work-name\" type=\"text\" class=\"form-control\" ng-model=\"work.name\" ng-minlength=2 ng-focus required placeholder=\"Name of Work\"/>\n" +
    "                      <div class=\"text-danger\" ng-show=\"form.$submitted && form.work-name.$invalid || form.work-name.$dirty && form.work-name.$invalid && !form.work-name.$focused\">\n" +
    "\n" +
    "                        <span ng-show=\"form.work-name.$error.required\">Name of Work is required</span>\n" +
    "                        <span ng-show=\"form.work-name.$error.minlength\">Name of Work is required to be at least 2 characters long</span>\n" +
    "\n" +
    "                      </div>\n" +
    "                    </div>\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "                  </div>\n" +
    "\n" +
    "\n" +
    "\n" +
    "            </form>\n" +
    "\n" +
    "   </div>\n" +
    "   <div class=\"modal-footer\" style=\"border-top:none\">\n" +
    "\n" +
    "      <button id=\"submit\" type=\"submit\" class=\"btn btn-primary-alt pull-right\"  style=\"width:120px\" ng-click = \"saveWork()\">Save</button>\n" +
    "    </div>\n" +
    " </div>\n" +
    "</div>\n" +
    "</div>\n"
  );
}])