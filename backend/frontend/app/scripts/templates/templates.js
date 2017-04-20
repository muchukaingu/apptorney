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
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "      <!--New heading -->\n" +
    "\n" +
    "\n" +
    "      <div class=\"modal-header\" style=\"margin-bottom:20px\">\n" +
    "\n" +
    "          <button type=\"button\" id=\"closeModal\" class=\"close\" data-dismiss=\"modal\" aria-hidden=\"true\">&times;</button>\n" +
    "          <div class=\"row\">\n" +
    "            <div class=\"col-sm-10\">\n" +
    "              <h4 ng-if=\"!viewMode\" style=\"font-weight: 100;\"><span id=\"CustomerHeading\">&nbsp;&nbsp;Add Case <button ng-click=\"toggleView()\" class=\"btn-primary-alt btn-xs\">View</button></span></h4>\n" +
    "              <h4 ng-if=\"viewMode\" style=\"font-weight: 100;\"><span id=\"CustomerHeading\">&nbsp;&nbsp;{{case.caseNumber}} <button ng-click=\"toggleView()\" class=\"btn-primary-alt btn-xs\">{{viewMode?\"Edit\":\"View\"}}</button></span> </h4>\n" +
    "\n" +
    "\n" +
    "              <p id=\"WelcomeMessage\" style=\"margin-left:8px; margin-top:-10px\" ng-if=\"!viewMode\">\n" +
    "                Please ensure that you fill in all the mandatory sections (marked with an asterisk, *) in the form.\n" +
    "              </p>\n" +
    "              <p id=\"WelcomeMessage\" style=\"margin-left:8px; margin-top:-10px; font-size:1.2em\" ng-if=\"viewMode\">\n" +
    "                <span style=\"font-weight:600\">{{case.name}} </span><br />\n" +
    "                <span class = \"text-success\" style=\"font-weight:600\" ng-if=\"case.secondaryReview\">Reviewed</span><br />\n" +
    "\n" +
    "\n" +
    "              </p>\n" +
    "            </div>\n" +
    "\n" +
    "            <div class=\"col-sm-2\">\n" +
    "              <div class=\"row\">\n" +
    "                <!--div class=\"col-sm-12\"><toggle-switch on-label = \"Reported\" off-label=\"Unreported\" model=\"case.reported\" class=\"primary\" knob-label=\"Status\"><toggle-switch></div-->\n" +
    "                <!--div class=\"col-sm-4\" style=\"padding-top:4px; font-size:1.3em\">Complete</div><div class=\"col-sm-8\"><toggle-switch on-label = \"Yes\" off-label=\"No\" model=\"case.completionStatus\" class=\"success\" knob-label=\"Status\"><toggle-switch></div-->\n" +
    "                <div class=\"col-sm-12 pull-right\"><button data-toggle=\"modal\" data-target=\"#caseReviewModal\" class=\"btn btn-warning btn-block\">Review</button></div>\n" +
    "              </div>\n" +
    "\n" +
    "\n" +
    "            </div>\n" +
    "          </div>\n" +
    "\n" +
    "      </div>\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "      <div class=\"modal-body\" style=\"margin-bottom: none; padding-top: 0px; border-bottom:none\">\n" +
    "\n" +
    "        <!-- Start Form-->\n" +
    "\n" +
    "        <form id =\"applicationForm\" name=\"form\" class=\"css-form\" ng-submit=\"saveApplication()\" novalidate ng-if=\"!viewMode\">\n" +
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
    "                                <input ng-repeat=\"plaintiff in case.plaintiffs\"  id=\"plaintiff\" name=\"plaintiff\" type=\"text\" class=\"form-control\" ng-model=\"plaintiff.name\" ng-minlength=2 ng-focus required placeholder=\"Name of Plaintiff\" ng-keydown = \"addPlaintiff($event)\" ng-style=\"{'margin-bottom':(case.parties.plaintiffs.length == 1)?'0px':'10px'}\"/>\n" +
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
    "                                <input ng-repeat=\"defendant in case.defendants\"  id=\"defendant\" name=\"defendant\" type=\"text\" class=\"form-control\" ng-model=\"defendant.name\" ng-minlength=2 ng-focus required placeholder=\"Name of Defendant\" ng-keydown = \"addDefendant($event)\" ng-style=\"{'margin-bottom':(case.parties.defendants.length == 1)?'0px':'10px'}\"/>\n" +
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
    "                                        <input id=\"plaintiffAdvocate\" name=\"plaintiffAdvocate\" type=\"text\" class=\"form-control\" ng-model=\"appearance.advocate\" ng-minlength=2 ng-focus required placeholder=\"Advocate\" ng-keydown = \"\" ng-style=\"{'margin-bottom':(case.parties.plaintiffAdvocates.length == 1)?'0px':'10px'}\"/>\n" +
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
    "                                      <input id=\"defendantAdvocate\" name=\"defendantAdvocate\" type=\"text\" class=\"form-control\" ng-model=\"appearance.advocate\" ng-minlength=2 ng-focus required placeholder=\"Advocate\" ng-keydown = \"\" ng-style=\"{'margin-bottom':(case.parties.defendantAdvocates.length == 1)?'0px':'10px'}\"/>\n" +
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
    "                      <input ng-repeat=\"judge in case.coram\" id=\"judge\" name=\"judge\" type=\"text\" class=\"form-control\" ng-model=\"judge.name\" ng-minlength=2 ng-focus required placeholder=\"Name of Judge\" ng-keydown = \"addJudge($event)\" ng-style=\"{'margin-bottom':(case.coram.length == 1)?'0px':'10px'}\"/>\n" +
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
    "                             <div class=\"col-xs-10\">Legislations</div>\n" +
    "                             <div class=\"col-xs-2 pull-right\">\n" +
    "                                <a class=\"pull-right\" style=\"color:#d3d3d3; border:#none; font-size:1.2em; border-radius:5px; margin-top:-2px\" data-toggle=\"modal\" data-target=\"#legislationReferencesModal\"><i class=\"fa fa-plus\"></i></a>\n" +
    "                             </div>\n" +
    "                             <div class=\"col-xs-12 form-group\">\n" +
    "\n" +
    "\n" +
    "                               <ui-select multiple tagging=\"createLegislationStab\" ng-keydown = \"saveLegislationStab($event)\" ng-model=\"case.legislationsReferedTo\" theme=\"bootstrap\">\n" +
    "                                   <ui-select-match placeholder=\"Select Legislations Referred To...\">{{$item.legislationName}} {{$item.dateOfAssent | date : 'yyyy'}}</ui-select-match>\n" +
    "                                   <ui-select-choices repeat=\"legislation in legislations | filter: $select.search\">\n" +
    "                                     <span ng-bind-html=\"legislation.legislationNumber | highlight: $select.search\"></span>&nbsp;-\n" +
    "                                     <span ng-bind-html=\"legislation.legislationName | highlight: $select.search\"></span>\n" +
    "                                     <small ng-bind-html=\"legislation.dateOfAssent | date : 'yyyy' | highlight: $select.search\"></small>\n" +
    "                                   </ui-select-choices>\n" +
    "                               </ui-select>\n" +
    "                             </div>\n" +
    "\n" +
    "                             <div class=\"col-xs-10\">Cases</div>\n" +
    "                             <div class=\"col-xs-2 pull-right\">\n" +
    "                                <a class=\"pull-right\" style=\"color:#d3d3d3; border:#none; font-size:1.2em; border-radius:5px; margin-top:-2px\" data-toggle=\"modal\" data-target=\"#caseReferencesModal\"><i class=\"fa fa-plus\"></i></a>\n" +
    "                             </div>\n" +
    "                             <div class=\"col-xs-12 form-group\">\n" +
    "\n" +
    "\n" +
    "                               <ui-select multiple tagging=\"createStab\" ng-keydown = \"saveStab($event)\" ng-model=\"case.casesReferedTo\" theme=\"bootstrap\">\n" +
    "                                   <ui-select-match placeholder=\"Select Cases Referred To...\">{{$item.name}}</ui-select-match>\n" +
    "                                   <ui-select-choices repeat=\"case in caseReferences | filter: $select.search\">\n" +
    "                                     <span ng-bind-html=\"case.name | highlight: $select.search\"></span>\n" +
    "                                     <small ng-bind-html=\"case.citation.year | highlight: $select.search\"></small>\n" +
    "                                   </ui-select-choices>\n" +
    "                               </ui-select>\n" +
    "                             </div>\n" +
    "\n" +
    "                            <div class=\"col-xs-10\">Works</div>\n" +
    "                            <div class=\"col-xs-2 pull-right\">\n" +
    "                               <a class=\"pull-right\" style=\"color:#d3d3d3; border:#none; font-size:1.2em; border-radius:5px; margin-top:-2px\" data-toggle=\"modal\" data-target=\"#workReferencesModal\"><i class=\"fa fa-plus\"></i></a>\n" +
    "                            </div>\n" +
    "                             <div class=\"col-xs-12 form-group\">\n" +
    "\n" +
    "\n" +
    "                               <ui-select multiple tagging ng-model=\"case.workReferedTo\" theme=\"bootstrap\">\n" +
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
    "        <!--div class=\"row\">\n" +
    "\n" +
    "              <div class=\"col-xs-12\">\n" +
    "\n" +
    "                <panel heading=\"Case Details\" >\n" +
    "                  <panel-controls>\n" +
    "                        <a href=\"\"><panel-control-collapse class=\"fa fa-chevron-down\"></panel-control-collapse></a>\n" +
    "\n" +
    "\n" +
    "\n" +
    "                  </panel-controls>\n" +
    "                  <div class=\"row\">\n" +
    "\n" +
    "                      <div class=\"col-lg-12\">\n" +
    "                        Area of Law: {{case.areaOfLaw}}\n" +
    "                      </div>\n" +
    "                  </div>\n" +
    "                </panel>\n" +
    "\n" +
    "\n" +
    "            </div>\n" +
    "        </div-->\n" +
    "\n" +
    "\n" +
    "        <ng-include src=\"'templates/case-view-mode.html'\"></ng-include>\n" +
    "\n" +
    "\n" +
    "     <!--  </div>  -->\n" +
    "\n" +
    "  </div>\n" +
    "  <div class=\"modal-footer\" style=\"\">\n" +
    "    <div class=\"row\">\n" +
    "      <div class = \"form-group col-xs-3 col-xs-offset-9\">\n" +
    "\n" +
    "        <button id=\"submit\" type=\"submit\" class=\"btn btn-primary-alt btn-block btn-md\" style=\"\" ng-click=\"saveCase()\" ng-class=\"{'btn btn-primary-alt pull-right':(saveStatus==0), 'btn btn-primary pull-right':(saveStatus == 1), 'btn btn-success pull-right':(saveStatus == 2)} \"  style=\"width:120px\"><i ng-if=\"saveStatus==1\" class='fa fa-fw fa-sun-o fa-spin'></i>{{(saveStatus==0)?'Save Case':(saveStatus==1)?'Saving...':'Saved'}}</button>\n" +
    "\n" +
    "      </div>\n" +
    "    </div>\n" +
    "\n" +
    "   </div>\n" +
    "</div>\n" +
    "</div>\n" +
    "\n" +
    "</div>\n" +
    "\n" +
    "<ng-include src=\"'templates/case-references-modal.html'\"></ng-include>\n" +
    "<ng-include src=\"'templates/legislation-references-modal.html'\"></ng-include>\n" +
    "<ng-include src=\"'templates/work-references-modal.html'\"></ng-include>\n" +
    "<ng-include src=\"'templates/case-review-modal.html'\"></ng-include>\n"
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


  $templateCache.put('templates/case-references-modal.html',
    "<div id=\"caseReferencesModal\" class=\"modal fade\" style=\"z-index:4000; background-color: rgba(0,0,0,0.5);\">\n" +
    "  <div class=\"modal-dialog\" style=\"width:40%;padding-left: 2%;padding-right: 2%;\">\n" +
    "    <div class=\"modal-content\" style=\"margin-top: 8%\">\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "  <div class=\"modal-body\" style=\"margin-bottom: none; padding-top: 10px; border-bottom:none; height:600px; overflow-y: auto;\">\n" +
    "\n" +
    "\n" +
    "\n" +
    "              <h2>Select Cases Referred To</h2>\n" +
    "              <div class=\"input-icon right mb10\">\n" +
    "                    <i class=\"fa fa-search\"></i>\n" +
    "                    <input type=\"text\" ng-model=\"queries.caseReferencesQuery\" class=\"form-control\" placeholder=\"Search...\" id=\"Search\" ng-keydown = \"saveStab($event)\">\n" +
    "              </div>\n" +
    "                  <table id=\"casesTbl\" class=\"table table-condensed\">\n" +
    "                    <tr style=\"background-color: #E8E9EC\" class=\"tableHeaders\">\n" +
    "                      <td style=\"width:5%\">\n" +
    "                        <a ng-click=\"sortType = 'caseNumber'; sortReverse = !sortReverse\">\n" +
    "                          Selected\n" +
    "                          <span ng-show=\"sortType == 'caseNumber' && !sortReverse\" class=\"fa fa-caret-up\"></span>\n" +
    "                          <span ng-show=\"sortType == 'caseNumber' && sortReverse\" class=\"fa fa-caret-down\"></span>\n" +
    "                        </a>\n" +
    "                      </td>\n" +
    "\n" +
    "                      <td style=\"width:45%\">\n" +
    "                        <a ng-click=\"sortType = 'name'; sortReverse = !sortReverse\">\n" +
    "                          Name of Case\n" +
    "                          <span ng-show=\"sortType == 'name' && !sortReverse\" class=\"fa fa-caret-up\"></span>\n" +
    "                          <span ng-show=\"sortType == 'name' && sortReverse\" class=\"fa fa-caret-down\"></span>\n" +
    "                        </a>\n" +
    "            </td>\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "                    </tr>\n" +
    "                    <tr id=\"rowTmp_Est\" ng-repeat=\"case in caseReferences | filter:queries.caseReferencesQuery | orderBy:sortType:sortReverse\" >\n" +
    "                      <td class=\"editables\">\n" +
    "\n" +
    "                          <input type=\"checkbox\" ng-change = \"addCaseReference(case)\" ng-model = \"case.selected\">\n" +
    "\n" +
    "                       </td>\n" +
    "\n" +
    "\n" +
    "                      <td class=\"editables\">\n" +
    "\n" +
    "                        <span class=\"editable\" name=\"applicantname\" form=\"rowform\" onchange=\"editItem(this,'itemID')\"\n" +
    "                          required>{{case.name}}\n" +
    "\n" +
    "                        </span>\n" +
    "\n" +
    "                      </td>\n" +
    "\n" +
    "                    </tr>\n" +
    "                  </table>\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "            <div ng-if=\"caseReferences.length == 0 && queries.caseReferencesQuery.length < 5 || caseReferences.length == 0 && queries.caseReferencesQuery == undefined\" style=\"position: relative; left: 30%; margin-left: -50px; height: 50px; margin-top: 40px\"><i ng-if=\"!returned\" class='fa fa-fw fa-sun-o fa-spin'></i> Type the first 5 characters in the name of the case to begin.</div>\n" +
    "            <div ng-if=\"queries.caseReferencesQuery.length > 4 && (caseReferences|filter:queries.caseReferencesQuery).length == 0 && caseReferences.length == 0\" style=\"position: relative; left: 50%; margin-left: -50px; height: 50px; margin-top: 40px\"><i class='fa fa-fw fa-sun-o fa-spin'></i>Searching for Cases. Please Wait...</div>\n" +
    "            <div ng-if=\"queries.caseReferencesQuery.length > 4 && (caseReferences|filter:queries.caseReferencesQuery).length == 0 && caseReferences.length > 0\" style=\"position: relative; left: 32%; margin-left: -50px; height: 50px; margin-top: 40px\"><i ng-if=\"!returned\" class='fa fa-fw fa-sun-o fa-spin'></i> No matches found. Press Enter to create Stub</div>\n" +
    "\n" +
    "        </div>\n" +
    "\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n"
  );


  $templateCache.put('templates/case-review-modal.html',
    "<div id=\"caseReviewModal\" class=\"modal fade\" style=\"z-index:3000; background-color:rgba(0, 0, 0, 0.5);\">\n" +
    "  <div class=\"modal-dialog\" style=\"width:30%;padding-left: 2%;padding-right: 2%; \">\n" +
    "    <div class=\"modal-content\" style=\"margin-top: 8%\">\n" +
    "      <div class=\"modal-header\">\n" +
    "          <button type=\"button\" id=\"closeModal\" class=\"close\" data-dismiss=\"modal\" aria-hidden=\"true\">&times;</button>\n" +
    "\n" +
    "        <h3 style=\"font-weight: 100;\"><span id=\"CustomerHeading\">&nbsp&nbspReview Case</span></h3>\n" +
    "\n" +
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
    "                        <div class=\"col-sm-9\" style=\"padding-top:4px; margin-top:20px; font-size:1.2em\">Is Case Complete?</div><div style=\"padding-top:4px; margin-top:20px; font-size:1.3em; position:relative; left:-10px\" class=\"col-sm-3\"><toggle-switch on-label = \"Yes\" off-label=\"No\" model=\"case.completionStatus\" class=\"success\" ><toggle-switch></div>\n" +
    "                        <div class=\"col-sm-9\" style=\"padding-top:4px; margin-top:5px; font-size:1.2em\">Have You Reviewed Case?</div><div style=\"padding-top:4px; margin-top:5px; font-size:1.3em; position:relative; left:-10px\" class=\"col-sm-3\"><toggle-switch on-label = \"Yes\" off-label=\"No\" model=\"case.primaryReview\" class=\"success\" ><toggle-switch></div>\n" +
    "                        <div class=\"col-sm-9\" style=\"padding-top:4px; margin-top:5px; font-size:1.2em\">Have You Reviewed Case?</div><div style=\"padding-top:4px; margin-top:5px; font-size:1.3em; position:relative; left:-10px\" class=\"col-sm-3\"><toggle-switch on-label = \"Yes\" off-label=\"No\" model=\"case.secondaryReview\" class=\"success\" ><toggle-switch></div>\n" +
    "\n" +
    "                    </div>\n" +
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
    "     <div class = \"form-group\">\n" +
    "       <button id=\"submit\" type=\"submit\" class=\"btn btn-primary-alt pull-right\"  style=\"width:120px\" ng-click=\"saveReview()\">Review</button>\n" +
    "\n" +
    "\n" +
    "       <div id=\"submitAppMsg\" class=\"pull-left\" style=\"font-size: larger; position: relative; top: 5px\"></div>\n" +
    "     </div>\n" +
    "\n" +
    "    </div>\n" +
    " </div>\n" +
    "</div>\n" +
    "</div>\n"
  );


  $templateCache.put('templates/case-view-mode.html',
    "<div class=\"row\" ng-if=\"viewMode\">\n" +
    "\n" +
    "      <div class=\"col-xs-12\">\n" +
    "\n" +
    "\n" +
    "          <div class=\"row\">\n" +
    "\n" +
    "              <div class=\"col-lg-12\">\n" +
    "                {{case.court.name}}\n" +
    "              </div>\n" +
    "              <div class=\"col-xs-12\" ng-repeat=\"judge in case.coram\">\n" +
    "                {{judge.name}}\n" +
    "              </div>\n" +
    "              <div class=\"col-xs-12\">\n" +
    "                {{case.citation.code}}/{{case.citation.number}}/{{case.citation.year}}\n" +
    "              </div>\n" +
    "\n" +
    "              <div class=\"col-xs-12\">\n" +
    "                Flynote (Area of Law): {{case.areaOfLaw.name}}\n" +
    "              </div>\n" +
    "\n" +
    "\n" +
    "              <div class=\"col-xs-12\">\n" +
    "\n" +
    "                  <panel heading=\"Headnote (Summary of Facts)\" >\n" +
    "                    <panel-controls>\n" +
    "                          <a href=\"\"><panel-control-collapse class=\"fa fa-chevron-down\"></panel-control-collapse></a>\n" +
    "                    </panel-controls>\n" +
    "                      <span style=\"white-space: pre-wrap;\" ng-bind-html=\"case.summaryOfFacts\"></span>\n" +
    "                  </panel>\n" +
    "              </div>\n" +
    "\n" +
    "\n" +
    "              <div class=\"col-xs-12\">\n" +
    "\n" +
    "                  <panel heading=\"Held (Summary of Ruling)\" >\n" +
    "                    <panel-controls>\n" +
    "                          <a href=\"\"><panel-control-collapse class=\"fa fa-chevron-down\"></panel-control-collapse></a>\n" +
    "                    </panel-controls>\n" +
    "                      <span style=\"white-space: pre-wrap;\" ng-bind-html=\"case.summaryOfRuling\"></span>\n" +
    "                  </panel>\n" +
    "              </div>\n" +
    "\n" +
    "\n" +
    "              <div class=\"col-xs-12\">\n" +
    "                <panel heading=\"Cases Referred To\" >\n" +
    "                  <panel-controls>\n" +
    "                        <a href=\"\"><panel-control-collapse class=\"fa fa-chevron-down\"></panel-control-collapse></a>\n" +
    "                  </panel-controls>\n" +
    "                    <ol>\n" +
    "                      <li ng-repeat=\"ref in case.casesReferedTo\">\n" +
    "                        {{ref.name}}\n" +
    "                      </li>\n" +
    "                    </ol>\n" +
    "                  </panel>\n" +
    "              </div>\n" +
    "\n" +
    "\n" +
    "              <div class=\"col-xs-12\">\n" +
    "                <panel heading=\"Judgement\" >\n" +
    "                  <panel-controls>\n" +
    "                        <a href=\"\"><panel-control-collapse class=\"fa fa-chevron-down\"></panel-control-collapse></a>\n" +
    "                  </panel-controls>\n" +
    "\n" +
    "                  <span style=\"white-space: pre-wrap;\" ng-bind-html=\"case.judgement\"></span>\n" +
    "                </panel>\n" +
    "              </div>\n" +
    "\n" +
    "          </div>\n" +
    "\n" +
    "\n" +
    "    </div>\n" +
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
    "                      <input ng-repeat=\"division in divisions\" id=\"division\" name=\"division\" type=\"text\" class=\"form-control\" ng-model=\"division.name\" ng-minlength=2 ng-focus required placeholder=\"Name of Division\" ng-keydown = \"addDivision($event)\" ng-style=\"{'margin-bottom':(courts.length == 1)?'0px':'10px'}\"/>\n" +
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


  $templateCache.put('templates/file-manager.html',
    "\n" +
    "        <div class=\"row\">\n" +
    "                <div class=\"col-md-12\">\n" +
    "                  \n" +
    "                    <input nv-file-select uploader=\"uploader\" type=\"file\" ng-show=\"true\" id=\"fileControl\" />\n" +
    "                </div>\n" +
    "                <div class=\"col-md-12\" style=\"margin-bottom: 40px; margin-top:20px\" ng-if=\"uploader.queue.length>0\">\n" +
    "                    <h3 style=\"margin-left:5px\">File Upload Details</h3>\n" +
    "                    <table class=\"table\">\n" +
    "                        <thead>\n" +
    "                            <tr><th width=\"50%\">Name</th><th ng-show=\"uploader.isHTML5\">Size</th><th ng-show=\"uploader.isHTML5\">Progress</th><th>Status</th><th>Actions</th></tr>\n" +
    "                        </thead>\n" +
    "                        <tbody>\n" +
    "                            <tr ng-repeat=\"item in uploader.queue\">\n" +
    "                                <td><strong>{{ item.file.name }}</strong></td>\n" +
    "                                <td ng-show=\"uploader.isHTML5\" nowrap>{{item.file.size/1024/1024|number:2 }} MB</td>\n" +
    "                                <td ng-show=\"uploader.isHTML5\">\n" +
    "                                    <div class=\"progress\" style=\"margin-bottom: 0;\">\n" +
    "                                        <div class=\"progress-bar\" role=\"progressbar\" ng-style=\"{ 'width': item.progress + '%' }\"></div>\n" +
    "                                    </div>\n" +
    "                                </td>\n" +
    "                                <td class=\"text-center\">\n" +
    "                                    <span ng-show=\"item.isSuccess\"><i class=\"glyphicon glyphicon-ok\"></i></span>\n" +
    "                                    <span ng-show=\"item.isCancel\"><i class=\"glyphicon glyphicon-ban-circle\"></i></span>\n" +
    "                                    <span ng-show=\"item.isError\"><i class=\"glyphicon glyphicon-remove\"></i></span>\n" +
    "                                </td>\n" +
    "                                <td nowrap>\n" +
    "                                    <button type=\"button\" class=\"btn btn-success btn-xs\" ng-click=\"item.upload()\" ng-disabled=\"item.isReady || item.isUploading || item.isSuccess\">\n" +
    "                                        <span class=\"glyphicon glyphicon-upload\"></span>\n" +
    "                                    </button>\n" +
    "                                    <button type=\"button\" class=\"btn btn-warning btn-xs\" ng-click=\"item.cancel()\" ng-disabled=\"!item.isUploading\">\n" +
    "                                        <span class=\"glyphicon glyphicon-ban-circle\"></span>\n" +
    "                                    </button>\n" +
    "                                    <button type=\"button\" class=\"btn btn-danger btn-xs\" ng-click=\"item.remove()\">\n" +
    "                                        <span class=\"glyphicon glyphicon-trash\"></span>\n" +
    "                                    </button>\n" +
    "                                </td>\n" +
    "                            </tr>\n" +
    "                        </tbody>\n" +
    "                    </table>\n" +
    "\n" +
    "        </div>\n"
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
    "  <div class=\"modal-dialog\" style=\"width:90%;padding-left: 2%;padding-right: 2%;\">\n" +
    "    <div class=\"modal-content\" style=\"margin-top: 8%\">\n" +
    "      <div class=\"modal-header\" style=\"margin-bottom:20px\">\n" +
    "\n" +
    "          <button type=\"button\" id=\"closeModal\" class=\"close\" data-dismiss=\"modal\" aria-hidden=\"true\">&times;</button>\n" +
    "          <div class=\"row\">\n" +
    "            <div class=\"col-xs-10\">\n" +
    "              <h4 ng-if=\"!viewMode\" style=\"font-weight: 100;\"><span id=\"CustomerHeading\">&nbsp;&nbsp;Add Legislation <button ng-click=\"toggleView()\" class=\"btn-primary-alt btn-xs\">View</button></span></h4>\n" +
    "              <h4 ng-if=\"viewMode\" style=\"font-weight: 100;\"><span id=\"CustomerHeading\">&nbsp;&nbsp;{{selectedType}} No. {{legislation.legislationNumber}}: of {{legislation.dateOfAssent | date:'yyyy'}} <button ng-click=\"toggleView()\" class=\"btn-primary-alt btn-xs\">Edit</button></span> </h4>\n" +
    "\n" +
    "\n" +
    "              <p id=\"WelcomeMessage\" style=\"margin-left:8px; margin-top:-10px\" ng-if=\"!viewMode\">\n" +
    "                Please ensure that you fill in all the mandatory sections (marked with an asterisk, *) in the form.\n" +
    "              </p>\n" +
    "              <p id=\"WelcomeMessage\" style=\"margin-left:8px; margin-top:-10px; font-size:1.2em\" ng-if=\"viewMode\">\n" +
    "                <span style=\"font-weight:600\">{{legislation.legislationName}} </span><br />\n" +
    "                Enacted by {{legislation.enactment}}<br />\n" +
    "                Assented on {{legislation.dateOfAssent | date:'MMMM d, yyyy'}}\n" +
    "\n" +
    "              </p>\n" +
    "            </div>\n" +
    "\n" +
    "            <div class=\"col-sm-2\"><toggle-switch on-label = \"Complete\" off-label=\"Incomplete\" model=\"legislation.completionStatus\" class=\"primary\" knob-label=\"Status\"><toggle-switch></div>\n" +
    "          </div>\n" +
    "\n" +
    "      </div>\n" +
    "\n" +
    "      <div class=\"modal-body\" style=\"margin-bottom: none; padding-top: 0px; border-bottom:none; padding-bottom:50%\">\n" +
    "\n" +
    "        <!-- Start Form-->\n" +
    "\n" +
    "              <form id =\"applicationForm\" name=\"form\" class=\"css-form\" ng-submit=\"saveApplication()\" novalidate>\n" +
    "                <span ng-if=\"!viewMode\">\n" +
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
    "                    <div class=\"col-xs-12 col-md-4 form-group\" ng-if = \"selectedType !=='Schedule'\">\n" +
    "                      <input id=\"volumeNumber\" name=\"volumeNumber\" type=\"text\" class=\"form-control\" ng-model=\"legislation.volumeNumber\" ng-minlength=2 ng-focus required placeholder=\"Volume Number\" />\n" +
    "                      <div class=\"text-danger\" ng-show=\"form.$submitted && form.volumeNumber.$invalid || form.volumeNumber.$dirty && form.volumeNumber.$invalid && !form.volumeNumber.$focused\">\n" +
    "\n" +
    "                        <span ng-show=\"form.volumeNumber.$error.required\">Volume Number is required</span>\n" +
    "                        <span ng-show=\"form.volumeNumber.$error.minlength\">Volume Number is required to be at least 2 characters long</span>\n" +
    "\n" +
    "                      </div>\n" +
    "                    </div>\n" +
    "\n" +
    "\n" +
    "                    <div class=\"col-xs-12 col-md-4 form-group\" ng-if = \"selectedType !=='Schedule'\">\n" +
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
    "                </span>\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "                  <div class=\"row\">\n" +
    "\n" +
    "                    <div class=\"col-xs-12\" ng-style = \"\" style=\"border-radius:5px; height:auto; padding-top:20px; padding-bottom:60px; width:97%; margin-left:12px;\">\n" +
    "\n" +
    "\n" +
    "                        <div class=\"row\">\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "                              <div class=\"container-fluid\" ng-controller=\"NestedTreeDemoController\">\n" +
    "\n" +
    "                                <panel heading=\"Preamble\" ng-if=\"viewMode\">\n" +
    "                                  <panel-controls>\n" +
    "                                        <a href=\"\"><panel-control-collapse class=\"fa fa-chevron-down\"></panel-control-collapse></a>\n" +
    "\n" +
    "\n" +
    "\n" +
    "                                  </panel-controls>\n" +
    "                                  <div class=\"row\">\n" +
    "\n" +
    "                                      <div class=\"col-lg-12\">\n" +
    "                                        {{legislation.preamble}}\n" +
    "                                      </div>\n" +
    "                                  </div>\n" +
    "                                </panel>\n" +
    "\n" +
    "                                    <script type=\"text/ng-template\" id=\"items_renderer.html\">\n" +
    "                                      <div ui-tree-handle style=\"padding-bottom:27px\">\n" +
    "                                        <a class=\"btn handletools expand\" data-nodrag ng-click=\"toggle(this)\">\n" +
    "                                          <span class=\"fa fa-fw\" ng-class=\"{'fa-plus-square-o': collapsed, 'fa-minus-square-o': !collapsed}\" ng-show=\"part.subParts.length\"></span>\n" +
    "                                        </a>\n" +
    "                                        <div class=\"pull-left\" style=\"color:gray\">{{part.number + ' ' + part.title}}</div>\n" +
    "                                        <a class=\"pull-right btn handletools delete\" data-nodrag ng-click=\"remove(this)\"><span class=\"fa fa-fw fa-trash-o\"></span></a>\n" +
    "                                        <a class=\"pull-right btn handletools edit\" data-nodrag ng-click=\"editPart(this)\" data-toggle=\"modal\" data-target=\"#addLegislationPart\"><span class=\"fa fa-fw fa-pencil\"></span></a>\n" +
    "                                        <a class=\"pull-right btn handletools add\" data-nodrag ng-click=\"newSubItem(this, $index, $$prevSibling)\"><span class=\"fa fa-fw fa-plus\"></span></a>\n" +
    "                                      </div>\n" +
    "                                      <ol ui-tree-nodes=\"options\" ng-model=\"part.subParts\" ng-class=\"{hidden: collapsed}\">\n" +
    "                                        <li ng-repeat=\"part in part.subParts\" ui-tree-node ng-include=\"'items_renderer.html'\">\n" +
    "\n" +
    "                                        </li>\n" +
    "                                      </ol>\n" +
    "                                      </div ui-tree-handle>\n" +
    "                                    </script>\n" +
    "\n" +
    "                                    <script type=\"text/ng-template\" id=\"items_view_renderer.html\">\n" +
    "                                        <span style=\"font-weight:600\">{{ part.number }} {{ part.title }}</span> <br>\n" +
    "                                        <span>{{ part.content }}</span><br>\n" +
    "                                        <span ng-if=\"part.file.type.substring(0,5)=='image'\"><img ng-src=\"{{ baseURL+part.file.url }}\" width=\"150px\" /></span><br> <!--change hard coding to server URL -->\n" +
    "                                        <span ng-if=\"part.file.type.substring(0,5)!=='image' && part.file !== undefined\"><a ng-href=\"{{ baseURL+part.file.url }}\">{{part.title}} File</a></span><br> <!--change hard coding to server URL -->\n" +
    "\n" +
    "\n" +
    "\n" +
    "                                        <ng-include src=\"'templates/table-viewable.html'\"></ng-include>\n" +
    "\n" +
    "\n" +
    "\n" +
    "                                        <ul>\n" +
    "                                          <p ng-repeat=\"part in part.subParts\" ng-include=\"'items_view_renderer.html'\">&emsp;</p>\n" +
    "                                        </ul>\n" +
    "                                    </script>\n" +
    "\n" +
    "                                  <panel heading=\"Legislation Components\">\n" +
    "                                    <panel-controls>\n" +
    "                                          <a href=\"\"><panel-control-collapse class=\"fa fa-chevron-down\"></panel-control-collapse></a>\n" +
    "                                          <a ng-if=\"!viewMode\" href=\"javascript:;\" ng-click=\"addLegislationPart()\"><i class=\"fa fa-plus\"></i></a>\n" +
    "\n" +
    "\n" +
    "                                    </panel-controls>\n" +
    "\n" +
    "\n" +
    "                                      <div class=\"row\" ng-show=\"legislation.legislationParts.length > 0\">\n" +
    "\n" +
    "                                          <div class=\"col-lg-12\">\n" +
    "                                            <div ui-tree=\"options\" ng-if=\"!viewMode\">\n" +
    "                                              <ol ui-tree-nodes ng-model=\"legislation.legislationParts\" >\n" +
    "                                                <li ng-repeat=\"part in legislation.legislationParts\" ui-tree-node ng-include=\"'items_renderer.html'\"></li>\n" +
    "                                              </ol>\n" +
    "                                            </div>\n" +
    "\n" +
    "                                            <p ng-repeat=\"part in legislation.legislationParts\" ng-include=\"'items_view_renderer.html'\" ng-if=\"viewMode\">\n" +
    "\n" +
    "                                            </p>\n" +
    "\n" +
    "                                          </div>\n" +
    "\n" +
    "                                          <!--div class=\"col-lg-6\">\n" +
    "                                              <h3>Full tree</h3>\n" +
    "                                              <pre class=\"code\">{{ legislation | json }}</pre>\n" +
    "                                          </div-->\n" +
    "\n" +
    "                                      </div>\n" +
    "\n" +
    "                                  </panel>\n" +
    "\n" +
    "                              </div> <!-- container -->\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "                        </div>\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "                        <span ng-show=\"legislation.legislationParts.length == 0 && parts_returned\" style=\"font-size:1.5em; font-weight:100; position:relative; left:42%\">Add Legislation Parts</span>\n" +
    "                        <div ng-if=\"!showParts\" style=\"font-size:1.5em; font-weight:100\"><i ng-if=\"!parts_returned\" class='fa fa-fw fa-sun-o fa-spin'></i> Loading. Please Wait...</div>\n" +
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
    "      <button id=\"submit\" ng-click=\"saveLegislation()\" type=\"submit\" class=\"btn btn-primary-alt pull-right\" ng-class=\"{'btn btn-primary-alt pull-right':(saveStatus==0), 'btn btn-primary pull-right':(saveStatus == 1), 'btn btn-success pull-right':(saveStatus == 2)} \"  style=\"width:120px\"><i ng-if=\"saveStatus==1\" class='fa fa-fw fa-sun-o fa-spin'></i>{{(saveStatus==0)?'Save Legislation':(saveStatus==1)?'Saving...':'Saved'}}</button>\n" +
    "\n" +
    "    </div>\n" +
    " </div>\n" +
    "</div>\n" +
    "\n" +
    "</div>\n" +
    "\n" +
    "<ng-include src=\"'templates/legislation-part-modal.html'\"></ng-include>\n"
  );


  $templateCache.put('templates/legislation-part-modal.html',
    "<div id=\"addLegislationPart\" class=\"modal fade\" style=\"z-index:3000; background-color:rgba(0, 0, 0, 0.5);\">\n" +
    "    <div class=\"modal-dialog\" style=\"width:50%;padding-left: 2%;padding-right: 2%; \">\n" +
    "        <div class=\"modal-content\" style=\"margin-top: 8%\">\n" +
    "              <div class=\"modal-header\" style=\"border-bottom:none\">\n" +
    "                  <button type=\"button\" id=\"closeModal\" class=\"close\" data-dismiss=\"modal\" aria-hidden=\"true\">&times;</button>\n" +
    "                  <h4 style=\"font-weight: 100;\"><span id=\"CustomerHeading\">&nbsp;&nbsp;Edit {{legislationPart.title}}</span></h4>\n" +
    "                  <p id=\"WelcomeMessage\" style=\"margin-left:12px\">Please ensure that you fill in all the mandatory sections in the form.</p>\n" +
    "              </div>\n" +
    "              <div class=\"modal-body\" style=\"margin-bottom: none; padding-top: 0px; border-bottom:none\">\n" +
    "                  <!-- Start Form-->\n" +
    "                  <form id =\"applicationForm\" name=\"form\" class=\"css-form\" novalidate>\n" +
    "                      <div class=\"row\">\n" +
    "                          <div class=\"col-xs-12 col-md-3 form-group\">\n" +
    "                              <input id=\"court-name\" name=\"court-name\" type=\"text\" class=\"form-control\" ng-model=\"legislationPart.number\" ng-focus placeholder=\"Number\" ng-if=\"legislationPart.level\"/>\n" +
    "                          </div>\n" +
    "                          <div class=\"\" ng-class=\"(legislationPart.level)?'col-xs-12 col-md-9 form-group':'col-xs-12 col-md-12 form-group'\">\n" +
    "                              <input id=\"court-name\" name=\"court-name\" type=\"text\" class=\"form-control\" ng-model=\"legislationPart.title\" ng-minlength=2 ng-focus required placeholder=\"Title\"/>\n" +
    "                              <div class=\"text-danger\" ng-show=\"form.$submitted && form.court-name.$invalid || form.court-name.$dirty && form.court-name.$invalid && !form.court-name.$focused\">\n" +
    "                                  <span ng-show=\"form.court-name.$error.required\">Title is required</span>\n" +
    "                                  <span ng-show=\"form.court-name.$error.minlength\">Title is required to be at least 2 characters long</span>\n" +
    "                              </div>\n" +
    "                          </div>\n" +
    "                          <div class=\"col-xs-12 col-md-12 form-group\">\n" +
    "                              <textarea id=\"preamble\" name=\"preamble\" type=\"text\" style=\"height: 90px; width:100%\"; min-word-count=\"2\"  class=\"form-control\" ng-model=\"legislationPart.content\"  ng-minlength=2 required ng-focus placeholder=\"Content *\"/>\n" +
    "                              <div class=\"text-danger\" ng-show=\"form.$submitted && form.preamble.$invalid || form.preamble.$dirty && form.preamble.$invalid && !form.preamble.$focused\">\n" +
    "                                <span ng-show=\"form.preamble.$error.required\">Content is required</span>\n" +
    "                                <span ng-show=\"form.preamble.$error.minlength\">Content is required to be at least 2 characters long</span>\n" +
    "                              </div>\n" +
    "                          </div>\n" +
    "\n" +
    "                          <div class=\"col-xs-12\" style=\"margin-top:-18px; margin-bottom:15px\">\n" +
    "          \n" +
    "                            <span ng-if=\"legislationPart.file.type.substring(0,5)=='image'\"><img ng-src=\"{{ baseURL+legislationPart.file.url }}\" width=\"150px\" /></span><br> <!--change hard coding to server URL -->\n" +
    "                            <span ng-if=\"legislationPart.file.type.substring(0,5)!=='image'\"><a ng-href=\"{{ baseURL+legislationPart.file.url }}\">{{legislationPart.title}} File</a></span><br> <!--change hard coding to server URL -->\n" +
    "                          </div>\n" +
    "\n" +
    "                    \t    <div class=\"col-xs-3 pull-left\" >\n" +
    "                      \t\t    <div class=\"btn-group\" data-dropdown>\n" +
    "                      \t\t      <button type=\"button\" class=\"btn btn-default-alt dropdown-toggle alt-border\" id=\"stageSelector\">\n" +
    "                      \t\t        <span ng-if=\"!filtered\">{{(legislationPart.file==undefined)?\"Add\":\"Replace\"}} Attachment</span>\n" +
    "                      \t\t        <i class=\"fa fa-caret-down\"></i>\n" +
    "                      \t\t      </button>\n" +
    "                      \t\t      <ul class=\"dropdown-menu\" role=\"menu\" style=\"text-align: left; position:relative; left:1px; padding-right:21px\">\n" +
    "                                   <li><a class=\"dropdown-toggle\" ng-click=\"addTable(); legislationPart.attachmentType = 'table'\"><i class=\"fa fa-th\"></i>&nbsp;&nbsp;Add Table&nbsp;&nbsp;&nbsp;&nbsp;</a></li>\n" +
    "                                   <li><a class=\"dropdown-toggle\" data-toggle=\"modal\" ng-click=\"legislationPart.attachmentType = 'file'\"><i class=\"fa fa-image\"></i></i>&nbsp;&nbsp;Add File&nbsp;&nbsp;&nbsp;&nbsp;</a></li>\n" +
    "                      \t\t         <!--li ng-repeat=\"type in legislationTypes\"><a class=\"dropdown-toggle\" ng-click=\"itemselected(stage)\"><i class=\"fa fa-file\"></i>&nbsp;&nbsp;Add {{type.name}}&nbsp;&nbsp;&nbsp;&nbsp;</a></li-->\n" +
    "                      \t\t      </ul>\n" +
    "                      \t\t    </div>\n" +
    "                    \t    </div>\n" +
    "                          <div class=\"col-xs-12 pull-left\" ng-if=\"legislationPart.attachmentType == 'file'\" style=\"margin-top:10px\" ng-controller = \"TestController\">\n" +
    "                            <ng-include src=\"'templates/file-manager.html'\"></ng-include>\n" +
    "                          </div>\n" +
    "                      </div>\n" +
    "                  </form>\n" +
    "                  <!-- End Form-->\n" +
    "                  <ng-include src=\"'templates/table.html'\" ng-if=\"legislationPart.attachmentType == 'table'\"></ng-include>\n" +
    "              </div>\n" +
    "              <div class=\"modal-footer\" style=\"border-top:none\"></div>\n" +
    "        </div>\n" +
    "    </div>\n" +
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


  $templateCache.put('templates/legislation-references-modal.html',
    "<div id=\"legislationReferencesModal\" class=\"modal fade\" style=\"z-index:4000; background-color: rgba(0,0,0,0.5);\">\n" +
    "  <div class=\"modal-dialog\" style=\"width:40%;padding-left: 2%;padding-right: 2%;\">\n" +
    "    <div class=\"modal-content\" style=\"margin-top: 8%\">\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "  <div class=\"modal-body\" style=\"margin-bottom: none; padding-top: 10px; border-bottom:none; height:600px; overflow-y: auto;\" >\n" +
    "\n" +
    "    <h2>Select Legislations Referred To</h2>\n" +
    "    <div class=\"input-icon right mb10\">\n" +
    "          <i class=\"fa fa-search\"></i>\n" +
    "          <input type=\"text\" ng-model=\"queries.legislationReferencesQuery\" class=\"form-control\" placeholder=\"Search...\" id=\"Search\" ng-keydown = \"saveLegislationStab($event)\">\n" +
    "    </div>\n" +
    "        <table id=\"casesTbl\" class=\"table table-condensed\">\n" +
    "          <tr style=\"background-color: #E8E9EC\" class=\"tableHeaders\">\n" +
    "            <td style=\"width:5%\">\n" +
    "              <a ng-click=\"sortType = 'caseNumber'; sortReverse = !sortReverse\">\n" +
    "                Selected\n" +
    "                <span ng-show=\"sortType == 'caseNumber' && !sortReverse\" class=\"fa fa-caret-up\"></span>\n" +
    "                <span ng-show=\"sortType == 'caseNumber' && sortReverse\" class=\"fa fa-caret-down\"></span>\n" +
    "              </a>\n" +
    "            </td>\n" +
    "\n" +
    "            <td style=\"width:45%\">\n" +
    "              <a ng-click=\"sortType = 'name'; sortReverse = !sortReverse\">\n" +
    "                Name of Legislation\n" +
    "                <span ng-show=\"sortType == 'name' && !sortReverse\" class=\"fa fa-caret-up\"></span>\n" +
    "                <span ng-show=\"sortType == 'name' && sortReverse\" class=\"fa fa-caret-down\"></span>\n" +
    "              </a>\n" +
    "  </td>\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "          </tr>\n" +
    "          <tr id=\"rowTmp_Est\" ng-repeat=\"legislation in legislationReferences | filter:queries.legislationReferencesQuery | orderBy:sortType:sortReverse\" >\n" +
    "            <td class=\"editables\">\n" +
    "\n" +
    "                <input type=\"checkbox\" ng-change = \"addLegislationReference(legislation)\" ng-model = \"legislation.selected\">\n" +
    "\n" +
    "             </td>\n" +
    "\n" +
    "\n" +
    "            <td class=\"editables\">\n" +
    "\n" +
    "              <span class=\"editable\" name=\"applicantname\" form=\"rowform\" onchange=\"editItem(this,'itemID')\"\n" +
    "                required>{{legislation.legislationName}}\n" +
    "\n" +
    "              </span>\n" +
    "\n" +
    "            </td>\n" +
    "\n" +
    "          </tr>\n" +
    "        </table>\n" +
    "\n" +
    "\n" +
    "        <div ng-if=\"legislationReferences.length == 0 && queries.legislationReferencesQuery.length < 5 || legislationReferences.length == 0 && queries.legislationReferencesQuery == undefined\" style=\"position: relative; left: 30%; margin-left: -50px; height: 50px; margin-top: 40px\"><i ng-if=\"!returned\" class='fa fa-fw fa-sun-o fa-spin'></i> Type the first 5 characters in the name of the legislation to begin.</div>\n" +
    "        <div ng-if=\"queries.legislationReferencesQuery.length > 4 && (legislationReferences|filter:queries.legislationReferencesQuery).length == 0 && legislationReferences.length == 0\" style=\"position: relative; left: 50%; margin-left: -50px; height: 50px; margin-top: 40px\"><i class='fa fa-fw fa-sun-o fa-spin'></i>Searching for Legislations. Please Wait...</div>\n" +
    "        <div ng-if=\"queries.legislationReferencesQuery.length > 4 && (legislationReferences|filter:queries.legislationReferencesQuery).length == 0 && legislationReferences.length > 0\" style=\"position: relative; left: 32%; margin-left: -50px; height: 50px; margin-top: 40px\"><i ng-if=\"!returned\" class='fa fa-fw fa-sun-o fa-spin'></i> No matches found. Press Enter to create Stub</div>\n" +
    "\n" +
    "  </div>\n" +
    "\n" +
    "</div>\n" +
    "</div>\n" +
    "\n" +
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


  $templateCache.put('templates/sub-legislation-modal.html',
    "<div id=\"addLegislationModal\" class=\"modal fade\" style=\"z-index:3000; background-color:rgba(0, 0, 0, 0.5);\">\n" +
    "  <div class=\"modal-dialog\" style=\"width:90%;padding-left: 2%;padding-right: 2%;\">\n" +
    "    <div class=\"modal-content\" style=\"margin-top: 8%\">\n" +
    "      <div class=\"modal-header\" style=\"margin-bottom:20px\">\n" +
    "\n" +
    "          <button type=\"button\" id=\"closeModal\" class=\"close\" data-dismiss=\"modal\" aria-hidden=\"true\">&times;</button>\n" +
    "          <div class=\"row\">\n" +
    "            <div class=\"col-xs-10\">\n" +
    "              <h4 ng-if=\"!viewMode\" style=\"font-weight: 100;\"><span id=\"CustomerHeading\">&nbsp;&nbsp;Add Legislation <button ng-click=\"toggleView()\" class=\"btn-primary-alt btn-xs\">View</button></span></h4>\n" +
    "              <h4 ng-if=\"viewMode\" style=\"font-weight: 100;\"><span id=\"CustomerHeading\">&nbsp;&nbsp;{{selectedType}} No. {{legislation.legislationNumber}}: of {{legislation.dateOfAssent | date:'yyyy'}} <button ng-click=\"toggleView()\" class=\"btn-primary-alt btn-xs\">Edit</button></span> </h4>\n" +
    "\n" +
    "\n" +
    "              <p id=\"WelcomeMessage\" style=\"margin-left:8px; margin-top:-10px\" ng-if=\"!viewMode\">\n" +
    "                Please ensure that you fill in all the mandatory sections (marked with an asterisk, *) in the form.\n" +
    "              </p>\n" +
    "              <p id=\"WelcomeMessage\" style=\"margin-left:8px; margin-top:-10px; font-size:1.2em\" ng-if=\"viewMode\">\n" +
    "                <span style=\"font-weight:600\">{{legislation.legislationName}} </span><br />\n" +
    "                Enacted by {{legislation.enactment}}<br />\n" +
    "                Assented on {{legislation.dateOfAssent | date:'MMMM d, yyyy'}}\n" +
    "\n" +
    "              </p>\n" +
    "            </div>\n" +
    "\n" +
    "            <div class=\"col-sm-2\"><toggle-switch on-label = \"Complete\" off-label=\"Incomplete\" model=\"legislation.completionStatus\" class=\"primary\" knob-label=\"Status\"><toggle-switch></div>\n" +
    "          </div>\n" +
    "\n" +
    "      </div>\n" +
    "\n" +
    "      <div class=\"modal-body\" style=\"margin-bottom: none; padding-top: 0px; border-bottom:none; padding-bottom:50%\">\n" +
    "\n" +
    "        <!-- Start Form-->\n" +
    "\n" +
    "              <form id =\"applicationForm\" name=\"form\" class=\"css-form\" ng-submit=\"saveApplication()\" novalidate>\n" +
    "                <span ng-if=\"!viewMode\">\n" +
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
    "                </span>\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "                  <div class=\"row\">\n" +
    "\n" +
    "                    <div class=\"col-xs-12\" ng-style = \"\" style=\"border-radius:5px; height:auto; padding-top:20px; padding-bottom:60px; width:97%; margin-left:12px;\">\n" +
    "\n" +
    "\n" +
    "                        <div class=\"row\">\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "                              <div class=\"container-fluid\" ng-controller=\"NestedTreeDemoController\">\n" +
    "\n" +
    "                                <panel heading=\"Preamble\" ng-if=\"viewMode\">\n" +
    "                                  <panel-controls>\n" +
    "                                        <a href=\"\"><panel-control-collapse class=\"fa fa-chevron-down\"></panel-control-collapse></a>\n" +
    "\n" +
    "\n" +
    "\n" +
    "                                  </panel-controls>\n" +
    "                                  <div class=\"row\">\n" +
    "\n" +
    "                                      <div class=\"col-lg-12\">\n" +
    "                                        {{legislation.preamble}}\n" +
    "                                      </div>\n" +
    "                                  </div>\n" +
    "                                </panel>\n" +
    "\n" +
    "                                    <script type=\"text/ng-template\" id=\"items_renderer.html\">\n" +
    "                                      <div ui-tree-handle style=\"padding-bottom:27px\">\n" +
    "                                        <a class=\"btn handletools expand\" data-nodrag ng-click=\"toggle(this)\">\n" +
    "                                          <span class=\"fa fa-fw\" ng-class=\"{'fa-plus-square-o': collapsed, 'fa-minus-square-o': !collapsed}\" ng-show=\"part.subParts.length\"></span>\n" +
    "                                        </a>\n" +
    "                                        <div class=\"pull-left\" style=\"color:gray\">{{part.number + ' ' + part.title}}</div>\n" +
    "                                        <a class=\"pull-right btn handletools delete\" data-nodrag ng-click=\"remove(this)\"><span class=\"fa fa-fw fa-trash-o\"></span></a>\n" +
    "                                        <a class=\"pull-right btn handletools edit\" data-nodrag ng-click=\"editPart(this)\" data-toggle=\"modal\" data-target=\"#addLegislationPart\"><span class=\"fa fa-fw fa-pencil\"></span></a>\n" +
    "                                        <a class=\"pull-right btn handletools add\" data-nodrag ng-click=\"newSubItem(this, $index, $$prevSibling)\"><span class=\"fa fa-fw fa-plus\"></span></a>\n" +
    "                                      </div>\n" +
    "                                      <ol ui-tree-nodes=\"options\" ng-model=\"part.subParts\" ng-class=\"{hidden: collapsed}\">\n" +
    "                                        <li ng-repeat=\"part in part.subParts\" ui-tree-node ng-include=\"'items_renderer.html'\">\n" +
    "\n" +
    "                                        </li>\n" +
    "                                      </ol>\n" +
    "                                      </div ui-tree-handle>\n" +
    "                                    </script>\n" +
    "\n" +
    "                                    <script type=\"text/ng-template\" id=\"items_view_renderer.html\">\n" +
    "                                        <span style=\"font-weight:600\">{{ part.number }} {{ part.title }}</span> <br>\n" +
    "                                        <span>{{ part.content }}</span><br>\n" +
    "                                        <span><img ng-src=\"{{ part.file }}\" width=\"100%\" /></span><br>\n" +
    "\n" +
    "                                        <ng-include src=\"'templates/table-viewable.html'\"></ng-include>\n" +
    "\n" +
    "\n" +
    "\n" +
    "                                        <ul>\n" +
    "                                          <p ng-repeat=\"part in part.subParts\" ng-include=\"'items_view_renderer.html'\">&emsp;</p>\n" +
    "                                        </ul>\n" +
    "                                    </script>\n" +
    "\n" +
    "                                  <panel heading=\"Legislation Components\">\n" +
    "                                    <panel-controls>\n" +
    "                                          <a href=\"\"><panel-control-collapse class=\"fa fa-chevron-down\"></panel-control-collapse></a>\n" +
    "                                          <a ng-if=\"!viewMode\" href=\"javascript:;\" ng-click=\"addLegislationPart()\"><i class=\"fa fa-plus\"></i></a>\n" +
    "\n" +
    "\n" +
    "                                    </panel-controls>\n" +
    "\n" +
    "\n" +
    "                                      <div class=\"row\" ng-show=\"legislation.legislationParts.length > 0\">\n" +
    "\n" +
    "                                          <div class=\"col-lg-12\">\n" +
    "                                            <div ui-tree=\"options\" ng-if=\"!viewMode\">\n" +
    "                                              <ol ui-tree-nodes ng-model=\"legislation.legislationParts\" >\n" +
    "                                                <li ng-repeat=\"part in legislation.legislationParts\" ui-tree-node ng-include=\"'items_renderer.html'\"></li>\n" +
    "                                              </ol>\n" +
    "                                            </div>\n" +
    "\n" +
    "                                            <p ng-repeat=\"part in legislation.legislationParts\" ng-include=\"'items_view_renderer.html'\" ng-if=\"viewMode\">\n" +
    "\n" +
    "                                            </p>\n" +
    "\n" +
    "                                          </div>\n" +
    "\n" +
    "                                          <!--div class=\"col-lg-6\">\n" +
    "                                              <h3>Full tree</h3>\n" +
    "                                              <pre class=\"code\">{{ legislation | json }}</pre>\n" +
    "                                          </div-->\n" +
    "\n" +
    "                                      </div>\n" +
    "\n" +
    "                                  </panel>\n" +
    "\n" +
    "                              </div> <!-- container -->\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "                        </div>\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "                        <span ng-show=\"legislation.legislationParts.length == 0 && parts_returned\" style=\"font-size:1.5em; font-weight:100; position:relative; left:42%\">Add Legislation Parts</span>\n" +
    "                        <div ng-if=\"!showParts\" style=\"font-size:1.5em; font-weight:100\"><i ng-if=\"!parts_returned\" class='fa fa-fw fa-sun-o fa-spin'></i> Loading. Please Wait...</div>\n" +
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
    "      <button id=\"submit\" ng-click=\"saveLegislation()\" type=\"submit\" class=\"btn btn-primary-alt pull-right\" ng-class=\"{'btn btn-primary-alt pull-right':(saveStatus==0), 'btn btn-primary pull-right':(saveStatus == 1), 'btn btn-success pull-right':(saveStatus == 2)} \"  style=\"width:120px\"><i ng-if=\"saveStatus==1\" class='fa fa-fw fa-sun-o fa-spin'></i>{{(saveStatus==0)?'Save Legislation':(saveStatus==1)?'Saving...':'Saved'}}</button>\n" +
    "\n" +
    "    </div>\n" +
    " </div>\n" +
    "</div>\n" +
    "\n" +
    "</div>\n" +
    "\n" +
    "<ng-include src=\"'templates/legislation-part-modal.html'\"></ng-include>\n"
  );


  $templateCache.put('templates/table-viewable.html',
    "\n" +
    "        <div class=\"container-fluid\" ng-controller=\"TablesViewableController\" ng-if=\"part.showTable\">\n" +
    "\n" +
    "          <div class=\"row\" ng-switch=\"colState\">\n" +
    "\n" +
    "              <style>\n" +
    "                  .circuit-editable {\n" +
    "                      color: gray !important;\n" +
    "                      border-bottom: dashed 1px gray !important;\n" +
    "                  }\n" +
    "              </style>\n" +
    "\n" +
    "              <div ng-switch-when=\"display_table\">\n" +
    "                  <div class=\"row\">\n" +
    "                      <div class=\"col-sm-8\">\n" +
    "                            <span style=\"font-weight:600; font-size:0.9em\">{{ part.table.title | uppercase}}</span><br/>\n" +
    "\n" +
    "\n" +
    "                      </div>\n" +
    "\n" +
    "                  </div>\n" +
    "              </div>\n" +
    "\n" +
    "              <div ng-keydown=\"checkKey($event)\" tabindex=\"1\"  ng-init=\"initViewable()\">\n" +
    "                  <table id=\"viewable\" class=\"table table-bordered table-condensed\" ng-init=\"page = part.table.tableHeaders; data = part.table.content; table_name = part.table.title\">\n" +
    "\n" +
    "                  </table>\n" +
    "              </div>\n" +
    "\n" +
    "\n" +
    "          </div>\n" +
    "        </div>\n"
  );


  $templateCache.put('templates/table.html',
    "\n" +
    "        <div class=\"container-fluid\" ng-controller=\"TablesEditableController\" ng-if=\"legislationPart.showTable\" style=\"margin-top:15px\">\n" +
    "\n" +
    "          <div class=\"row\" ng-switch=\"colState\">\n" +
    "\n" +
    "              <style>\n" +
    "                  .circuit-editable {\n" +
    "                      color: gray !important;\n" +
    "                      border-bottom: dashed 1px gray !important;\n" +
    "                  }\n" +
    "              </style>\n" +
    "\n" +
    "              <div ng-switch-when=\"display_table\">\n" +
    "                  <div class=\"row\">\n" +
    "                      <div class=\"col-sm-8\">\n" +
    "                          <h3><a href=\"javascript:;\" class=\"circuit-editable\" editable-text=\"legislationPart.table.title\" e-label=\"Table Name\">{{ legislationPart.table.title }}</a></h3>\n" +
    "                      </div>\n" +
    "                      <div class=\"col-sm-4\">\n" +
    "                          <a class=\"btn btn-md pull-right\" ng-click=\"addColumn()\"><i class=\"fa fa-plus\"></i></a>\n" +
    "                      </div>\n" +
    "                  </div>\n" +
    "              </div>\n" +
    "\n" +
    "              <div ng-keydown=\"checkKey($event)\" tabindex=\"1\"  ng-init=\"init()\">\n" +
    "                  <table id=\"test\" class=\"table table-bordered table-condensed\" ng-init=\"page = legislationPart.table.tableHeaders; data = legislationPart.table.content; table_name = legislationPart.table.title\">\n" +
    "\n" +
    "                  </table>\n" +
    "              </div>\n" +
    "\n" +
    "              <div ng-switch-when=\"display_table\">\n" +
    "\n" +
    "                  <a class=\"btn btn-md\" ng-click=\"addData()\"><i class=\"fa fa-plus\"></i></a>\n" +
    "\n" +
    "              </div>\n" +
    "          </div>\n" +
    "        </div>\n"
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


  $templateCache.put('templates/view-legislation-modal.html',
    "<div id=\"viewLegislationModal\" class=\"modal fade\">\n" +
    "  <div class=\"modal-dialog\" style=\"width:65%;\">\n" +
    "    <div class=\"modal-content\" style=\"margin-top: 8%; padding: 40px; \">\n" +
    "      <div class=\"modal-header\" style=\"border-bottom:none\">\n" +
    "          <button type=\"button\" id=\"closeModal\" class=\"close\" data-dismiss=\"modal\" aria-hidden=\"true\">&times;</button>\n" +
    "\n" +
    "      </div>\n" +
    "\n" +
    "      <div class=\"modal-body\" style=\"margin-bottom: none; padding-top: 0px; border-bottom:none\">\n" +
    "\n" +
    "<div class=\"row\">\n" +
    "\n" +
    "  <div class=\"col-xs-12\" style=\"border-bottom:1px solid black\">\n" +
    "        <span style=\"font-weight: 500; font-size: 16pt\"><span id=\"CustomerHeading\"> {{legislation.legislationName+\"     [\"+legislation.legislationNumber+\"]\"}}</span><br/></span>\n" +
    "  </div>\n" +
    "  <div class=\"col-xs-6 pull-right text-right\" style=\"\"><span style=\"font-weight: 500; font-size: 16pt\"><span id=\"viewCompany\"></span></span><br/><span id=\"applicationNumber\" style=\"font-size: 1.5em\">{{legislation.companyName}}</span></div>\n" +
    "</div>\n" +
    "        <!-- Start Form-->\n" +
    "\n" +
    "        <form id =\"viewLegislationForm\" name=\"form\" class=\"css-form\" ng-submit=\"addCustomer()\" novalidate>\n" +
    "          <div class =\"row\" style=\"border-bottom: 1px dashed #7a869c; padding-bottom: 0px; margin-bottom: 20px; margin-top: 10px\">\n" +
    "            <!-- <div class=\"col-xs-4 form-group\">\n" +
    "            <span><b>Name Of Applicant: </b></span>\n" +
    "            <span id = \"viewApplicantName\"></span>\n" +
    "          </div> -->\n" +
    "          <div class=\"col-xs-12 col-sm-6\">\n" +
    "            <table class=\"table\">\n" +
    "\n" +
    "              <tr>\n" +
    "                <td><i class=\"fa fa-phone\"></i>&nbsp;Contact Number(s)</td><td><span id = \"viewContact\">{{legislation.telephoneNumber}}</span></td>\n" +
    "              </tr>\n" +
    "               <tr>\n" +
    "                <td><i class=\"fa fa-envelope\"></i>&nbsp;Email Address</td><td><span id = \"viewEmail\">{{legislation.email}}</span></td>\n" +
    "              </tr>\n" +
    "              <tr>\n" +
    "                <td><i class=\"fa fa-twitter\"></i>&nbsp;Twitter</td><td><span id = \"viewTwitter\">{{legislation.twitterHandle}}</span></td>\n" +
    "              </tr>\n" +
    "              <tr>\n" +
    "                <td><i class=\"fa fa-linkedin\"></i>&nbsp;LinkedIn</td><td><span id = \"viewLinkedin\">{{legislation.linkedInProfile}}</span></td>\n" +
    "              </tr>\n" +
    "              <tr>\n" +
    "                <td><i class=\"fa fa-globe\"></i>&nbsp;Website</td><td><span id = \"viewWebsite\">{{legislation.website}}</span></td>\n" +
    "              </tr>\n" +
    "\n" +
    "            </table>\n" +
    "          </div>\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "          </div>\n" +
    "    <div class =\"row\">\n" +
    "      <span style=\"font-size:1.2em\">Please share your business idea (100 words or less)*</span><br/>\n" +
    "      <div>\n" +
    "      <span id = \"viewIdea\">{{legislation.idea}}\n" +
    "      </span>\n" +
    "    </div>\n" +
    "    </div>\n" +
    "\n" +
    "    <br>\n" +
    "    <br>\n" +
    "    <div class =\"row\">\n" +
    "      <span style=\"font-size:1.2em\">What need and/or solution are you filling? (100 words or less)*</span><br/>\n" +
    "      <div>\n" +
    "      <span id = \"viewSolution\">{{legislation.solution}}\n" +
    "      </span>\n" +
    "    </div>\n" +
    "\n" +
    "    </div>\n" +
    "\n" +
    "    <br>\n" +
    "    <br>\n" +
    "    <div class =\"row\">\n" +
    "      <span style=\"font-size:1.2em\">Please share a little about your product and/or service (200 words or less)*</span><br/>\n" +
    "      <div>\n" +
    "      <span id = \"viewProductInformation\">{{legislation.product}}\n" +
    "      </span>\n" +
    "    </div>\n" +
    "\n" +
    "    </div>\n" +
    "\n" +
    "    <br>\n" +
    "    <br>\n" +
    "    <div class =\"row\">\n" +
    "      <span style=\"font-size:1.2em\">Tell us a little about your market size? (100 words or less)*</span><br/>\n" +
    "      <div>\n" +
    "      <span id = \"viewMarketInformation\">{{legislation.market}}\n" +
    "      </span>\n" +
    "    </div>\n" +
    "\n" +
    "    </div>\n" +
    "\n" +
    "    <br>\n" +
    "    <br>\n" +
    "    <div class =\"row\">\n" +
    "      <span style=\"font-size:1.2em\">What revenue steam and/or streams do you have? How does your company make money? (200 words or less)*</span><br/>\n" +
    "      <div>\n" +
    "      <span id = \"viewRevenue\">{{legislation.revenue}}\n" +
    "      </span>\n" +
    "    </div>\n" +
    "\n" +
    "    </div>\n" +
    "\n" +
    "    <br>\n" +
    "    <br>\n" +
    "    <div class =\"row\">\n" +
    "      <span style=\"font-size:1.2em\">Who is on your management team and what is their experience? (200 words or less)*</span><br/>\n" +
    "      <div>\n" +
    "      <span id = \"viewTeamInformation\">{{legislation.team}}\n" +
    "      </span>\n" +
    "    </div>\n" +
    "\n" +
    "    </div>\n" +
    "\n" +
    "    <br>\n" +
    "    <br>\n" +
    "    <div class =\"row\">\n" +
    "      <span style=\"font-size:1.2em\">Share with us how you are going to go to market. What is your strategy? (200 words or less)*</span><br/>\n" +
    "      <div>\n" +
    "      <span id = \"viewStrategy\">{{legislation.team}}\n" +
    "      </span>\n" +
    "    </div>\n" +
    "\n" +
    "    </div>\n" +
    "\n" +
    "    <br>\n" +
    "    <br>\n" +
    "    <div class =\"row\">\n" +
    "      <span style=\"font-size:1.2em\">Do you have any funding requirements to support growing your startup? (100 words or less)*</span><br/>\n" +
    "      <div>\n" +
    "      <span id = \"viewFunding\">{{legislation.funding}}\n" +
    "      </span>\n" +
    "    </div>\n" +
    "\n" +
    "    </div>\n" +
    "\n" +
    "\n" +
    "\n" +
    "          <!-- <input type=\"button\" class=\"btn btn-default\" ng-click=\"reset(form)\" value=\"Reset\" /> -->\n" +
    "          <div class = \"form-group\">\n" +
    "            <!-- <button id=\"submit\" type=\"button\" class=\"btn btn-primary-alt pull-right\" onclick=\"saveLegislation()\" ng-disabled=\"form.$invalid\" style=\"width:120px\">Save</button>\n" +
    "            <button id=\"resubmit\" type=\"button\" class=\"btn btn-primary-alt pull-right\" onclick=\"saveEditedLegislation()\" style=\"width:120px\">Save</button> -->\n" +
    "\n" +
    "\n" +
    "            <!-- <div id=\"submitAppMsg\" class=\"pull-left\" style=\"font-size: larger; position: relative; top: 5px\"></div> -->\n" +
    "          </div>\n" +
    "          <div class=\"modal-footer\" style=\"border-top:none\">\n" +
    "\n" +
    "            <!-- <button id=\"save\" type=\"button\" class=\"btn btn-primary-alt\" onclick=\"saveLegislation()\" ng-submit=\"form.$valid && saveLegislation()\" style=\"width:120px\">Save</button> -->\n" +
    "\n" +
    "           </div>\n" +
    "\n" +
    "        </form>  <!--End Form-->\n" +
    "\n" +
    "\n" +
    "     <!--  </div>  -->\n" +
    "    </div>\n" +
    "  </div>\n" +
    "</div> <!-- end modal -->\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "</div>    <!-- container -->\n"
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


  $templateCache.put('templates/work-references-modal.html',
    "<div id=\"workReferencesModal\" class=\"modal fade\" style=\"z-index:4000; background-color: rgba(0,0,0,0.5);\">\n" +
    "  <div class=\"modal-dialog\" style=\"width:40%;padding-left: 2%;padding-right: 2%;\">\n" +
    "    <div class=\"modal-content\" style=\"margin-top: 8%\">\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "  <div class=\"modal-body\" style=\"margin-bottom: none; padding-top: 10px; border-bottom:none; height:600px; overflow-y: auto;\">\n" +
    "    <h2>Select Work Referred To</h2>\n" +
    "    <div class=\"input-icon right mb10\">\n" +
    "          <i class=\"fa fa-search\"></i>\n" +
    "          <input type=\"text\" ng-model=\"queries.workReferencesQuery\" class=\"form-control\" placeholder=\"Search...\" id=\"Search\" ng-keydown = \"saveWorkStab($event)\">\n" +
    "    </div>\n" +
    "        <table id=\"casesTbl\" class=\"table table-condensed\">\n" +
    "          <tr style=\"background-color: #E8E9EC\" class=\"tableHeaders\">\n" +
    "            <td style=\"width:5%\">\n" +
    "              <a ng-click=\"sortType = 'caseNumber'; sortReverse = !sortReverse\">\n" +
    "                Selected\n" +
    "                <span ng-show=\"sortType == 'caseNumber' && !sortReverse\" class=\"fa fa-caret-up\"></span>\n" +
    "                <span ng-show=\"sortType == 'caseNumber' && sortReverse\" class=\"fa fa-caret-down\"></span>\n" +
    "              </a>\n" +
    "            </td>\n" +
    "\n" +
    "            <td style=\"width:45%\">\n" +
    "              <a ng-click=\"sortType = 'name'; sortReverse = !sortReverse\">\n" +
    "                Name of Work\n" +
    "                <span ng-show=\"sortType == 'name' && !sortReverse\" class=\"fa fa-caret-up\"></span>\n" +
    "                <span ng-show=\"sortType == 'name' && sortReverse\" class=\"fa fa-caret-down\"></span>\n" +
    "              </a>\n" +
    "  </td>\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "          </tr>\n" +
    "          <tr id=\"rowTmp_Est\" ng-repeat=\"work in workReferences | filter:queries.workReferencesQuery | orderBy:sortType:sortReverse\" >\n" +
    "            <td class=\"editables\">\n" +
    "\n" +
    "              <input type=\"checkbox\" ng-change = \"addWorkReference(work)\" ng-model = \"work.selected\">\n" +
    "\n" +
    "             </td>\n" +
    "\n" +
    "\n" +
    "            <td class=\"editables\">\n" +
    "\n" +
    "              <span class=\"editable\" name=\"applicantname\" form=\"rowform\" onchange=\"editItem(this,'itemID')\"\n" +
    "                required>{{work.name}}\n" +
    "\n" +
    "              </span>\n" +
    "\n" +
    "            </td>\n" +
    "\n" +
    "          </tr>\n" +
    "        </table>\n" +
    "\n" +
    "\n" +
    "        <div ng-if=\"workReferences.length == 0 && queries.workReferencesQuery.length < 5 || workReferences.length == 0 && queries.workReferencesQuery == undefined\" style=\"position: relative; left: 30%; margin-left: -50px; height: 50px; margin-top: 40px\"><i ng-if=\"!returned\" class='fa fa-fw fa-sun-o fa-spin'></i> Type the first 5 characters in the name of the work to begin.</div>\n" +
    "        <div ng-if=\"queries.workReferencesQuery.length > 4 && (workReferences|filter:queries.workReferencesQuery).length == 0 && workReferences.length == 0\" style=\"position: relative; left: 50%; margin-left: -50px; height: 50px; margin-top: 40px\"><i class='fa fa-fw fa-sun-o fa-spin'></i>Searching for Works. Please Wait...</div>\n" +
    "        <div ng-if=\"queries.workReferencesQuery.length > 4 && (workReferences|filter:queries.workReferencesQuery).length == 0 && workReferences.length > 0\" style=\"position: relative; left: 32%; margin-left: -50px; height: 50px; margin-top: 40px\"><i ng-if=\"!returned\" class='fa fa-fw fa-sun-o fa-spin'></i> No matches found. Press Enter to create Stub</div>\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "  </div>\n" +
    "\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n"
  );
}])