// Send email to user for forgot password
export const getForgotPasswordTemplate = (data: any) => {
    const { fullName, url } = data;
    return `<!doctype html>
    <html lang="en">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
        <meta name="x-apple-disable-message-reformatting">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <title>Account Password Reset</title>
    
        <style>
            .o_sans,
            .o_heading {
                font-family: Helvetica, Arial, sans-serif;
            }
    
            .o_heading {
                font-weight: bold;
            }
    
            .o_sans,
            .o_heading,
            .o_sans p,
            .o_sans li {
                margin-top: 0px;
                margin-bottom: 0px;
            }
    
            a {
                text-decoration: none;
                outline: none;
            }
    
            .o_underline {
                text-decoration: underline;
            }
    
            .o_linethrough {
                text-decoration: line-through;
            }
    
            .o_nowrap {
                white-space: nowrap;
            }
    
            .o_caps {
                text-transform: uppercase;
                letter-spacing: 1px;
            }
    
            .o_nowrap {
                white-space: nowrap;
            }
    
            .o_text-xxs {
                font-size: 12px;
                line-height: 19px;
            }
    
            .o_text-xs {
                font-size: 14px;
                line-height: 21px;
            }
    
            .o_text {
                font-size: 16px;
                line-height: 24px;
            }
    
            .o_text-md {
                font-size: 19px;
                line-height: 28px;
            }
    
            .o_text-lg {
                font-size: 24px;
                line-height: 30px;
            }
    
            h1.o_heading {
                font-size: 36px;
                line-height: 47px;
            }
    
            h2.o_heading {
                font-size: 30px;
                line-height: 39px;
            }
    
            h3.o_heading {
                font-size: 24px;
                line-height: 31px;
            }
    
            h4.o_heading {
                font-size: 18px;
                line-height: 23px;
            }
    
            body,
            .e_body {
                width: 100%;
                margin: 0px;
                padding: 0px;
                -webkit-text-size-adjust: 100%;
                -ms-text-size-adjust: 100%;
            }
    
            .o_re {
                font-size: 0;
                vertical-align: top;
            }
    
            .o_block {
                max-width: 632px;
                margin: 0 auto;
            }
    
            .o_block-lg {
                max-width: 800px;
                margin: 0 auto;
            }
    
            .o_block-xs {
                max-width: 432px;
                margin: 0 auto;
            }
    
            .o_col,
            .o_col_i {
                display: inline-block;
                vertical-align: top;
            }
    
            .o_col {
                width: 100%;
            }
    
            .o_col-1 {
                max-width: 100px;
            }
    
            .o_col-o {
                max-width: 132px;
            }
    
            .o_col-2 {
                max-width: 200px;
            }
    
            .o_col-3 {
                max-width: 300px;
            }
    
            .o_col-4 {
                max-width: 400px;
            }
    
            .o_col-oo {
                max-width: 468px;
            }
    
            .o_col-5 {
                max-width: 500px;
            }
    
            .o_col-6s {
                max-width: 584px;
            }
    
            .o_col-6 {
                max-width: 600px;
            }
    
            img {
                -ms-interpolation-mode: bicubic;
                vertical-align: middle;
                border: 0;
                line-height: 100%;
                height: auto;
                outline: none;
                text-decoration: none;
            }
    
            .o_img-full {
                width: 100%;
            }
    
            .o_inline {
                display: inline-block;
            }
    
            .o_btn {
                mso-padding-alt: 12px 24px;
            }
    
                .o_btn a {
                    display: block;
                    padding: 12px 24px;
                    mso-text-raise: 3px;
                }
    
            .o_btn-o {
                mso-padding-alt: 8px 20px;
            }
    
                .o_btn-o a {
                    display: block;
                    padding: 8px 20px;
                    mso-text-raise: 3px;
                }
    
            .o_btn-xs {
                mso-padding-alt: 7px 16px;
            }
    
                .o_btn-xs a {
                    display: block;
                    padding: 7px 16px;
                    mso-text-raise: 3px;
                }
    
            .o_btn-b {
                mso-padding-alt: 7px 8px;
            }
    
                .o_btn-b a {
                    display: block;
                    padding: 7px 8px;
                    font-weight: bold;
                }
    
                .o_btn-b span {
                    mso-text-raise: 6px;
                    display: inline;
                }
    
            .img_fix {
                mso-text-raise: 6px;
                display: inline;
            }
    
            .o_bg-light {
                background-color: #dbe5ea;
            }
    
            .o_bg-ultra_light {
                background-color: #ebf5fa;
            }
    
            .o_bg-white {
                background-color: #ffffff;
            }
    
            .o_bg-dark {
                background-color: #242b3d;
            }
    
            .o_bg-primary {
                background-color: #126de5;
            }
    
            .o_bg-secondary {
                background-color: #424651;
            }
    
            .o_bg-success {
                background-color: #0ec06e;
            }
    
            .o_text-primary,
            a.o_text-primary span,
            a.o_text-primary strong,
            .o_text-primary.o_link a {
                color: #126de5;
            }
    
            .o_text-secondary,
            a.o_text-secondary span,
            a.o_text-secondary strong,
            .o_text-secondary.o_link a {
                color: #424651;
            }
    
            .o_text-dark,
            a.o_text-dark span,
            a.o_text-dark strong,
            .o_text-dark.o_link a {
                color: #242b3d;
            }
    
            .o_text-dark_light,
            a.o_text-dark_light span,
            a.o_text-dark_light strong,
            .o_text-dark_light.o_link a {
                color: #a0a3ab;
            }
    
            .o_text-white,
            a.o_text-white span,
            a.o_text-white strong,
            .o_text-white.o_link a {
                color: #ffffff;
            }
    
            .o_text-light,
            a.o_text-light span,
            a.o_text-light strong,
            .o_text-light.o_link a {
                color: #82899a;
            }
    
            .o_text-success,
            a.o_text-success span,
            a.o_text-success strong,
            .o_text-success.o_link a {
                color: #0ec06e;
            }
    
            .o_b-primary {
                border: 2px solid #126de5;
            }
    
            .o_bb-primary {
                border-bottom: 1px solid #126de5;
            }
    
            .o_b-secondary {
                border: 2px solid #424651;
            }
    
            .o_bx-secondary {
                border: 1px solid #424651;
            }
    
            .o_bb-secondary {
                border-bottom: 1px solid #424651;
            }
    
            .o_b-dark {
                border: 2px solid #242b3d;
            }
    
            .o_b-light {
                border: 1px solid #d3dce0;
            }
    
            .o_bb-light {
                border-bottom: 1px solid #d3dce0;
            }
    
            .o_bt-light {
                border-top: 1px solid #d3dce0;
            }
    
            .o_br-light {
                border-right: 4px solid #d3dce0;
            }
    
            .o_bb-ultra_light {
                border-bottom: 1px solid #b6c0c7;
            }
    
            .o_bb-dark_light {
                border-bottom: 1px solid #4a5267;
            }
    
            .o_bt-dark_light {
                border-top: 1px solid #4a5267;
            }
    
            .o_b-white {
                border: 2px solid #ffffff;
            }
    
            .o_bb-white {
                border-bottom: 1px solid #ffffff;
            }
    
            .o_br {
                border-radius: 4px;
            }
    
            .o_br-t {
                border-radius: 4px 4px 0px 0px;
            }
    
            .o_br-b {
                border-radius: 0px 0px 4px 4px;
            }
    
            .o_br-l {
                border-radius: 4px 0px 0px 4px;
            }
    
            .o_br-r {
                border-radius: 0px 4px 4px 0px;
            }
    
            .o_br-max {
                border-radius: 96px;
            }
    
            .o_hide,
            .o_hide-lg {
                display: none;
                font-size: 0;
                max-height: 0;
                width: 0;
                line-height: 0;
                overflow: hidden;
                mso-hide: all;
                visibility: hidden;
            }
    
            .o_center {
                text-align: center;
            }
    
            table.o_center {
                margin-left: auto;
                margin-right: auto;
            }
    
            .o_left {
                text-align: left;
            }
    
            table.o_left {
                margin-left: 0;
                margin-right: auto;
            }
    
            .o_right {
                text-align: right;
            }
    
            table.o_right {
                margin-left: auto;
                margin-right: 0;
            }
    
            .o_px {
                padding-left: 16px;
                padding-right: 16px;
            }
    
            .o_px-xs {
                padding-left: 8px;
                padding-right: 8px;
            }
    
            .o_px-md {
                padding-left: 24px;
                padding-right: 24px;
            }
    
            .o_px-lg {
                padding-left: 32px;
                padding-right: 32px;
            }
    
            .o_py {
                padding-top: 16px;
                padding-bottom: 16px;
            }
    
            .o_py-xs {
                padding-top: 8px;
                padding-bottom: 8px;
            }
    
            .o_py-md {
                padding-top: 24px;
                padding-bottom: 24px;
            }
    
            .o_py-lg {
                padding-top: 32px;
                padding-bottom: 32px;
            }
    
            .o_py-xl {
                padding-top: 64px;
                padding-bottom: 64px;
            }
    
            .o_pt-xs {
                padding-top: 8px;
            }
    
            .o_pt {
                padding-top: 16px;
            }
    
            .o_pt-md {
                padding-top: 24px;
            }
    
            .o_pt-lg {
                padding-top: 32px;
            }
    
            .o_pb-xs {
                padding-bottom: 8px;
            }
    
            .o_pb {
                padding-bottom: 16px;
            }
    
            .o_pb-md {
                padding-bottom: 24px;
            }
    
            .o_pb-lg {
                padding-bottom: 32px;
            }
    
            .o_p-icon {
                padding: 12px;
            }
    
            .o_body .o_mb-xxs {
                margin-bottom: 4px;
            }
    
            .o_body .o_mb-xs {
                margin-bottom: 8px;
            }
    
            .o_body .o_mb {
                margin-bottom: 16px;
            }
    
            .o_body .o_mb-md {
                margin-bottom: 24px;
            }
    
            .o_body .o_mb-lg {
                margin-bottom: 32px;
            }
    
            .o_body .o_mt {
                margin-top: 16px;
            }
    
            .o_body .o_mt-md {
                margin-top: 24px;
            }
    
            .o_bg-center {
                background-position: 50% 0;
                background-repeat: no-repeat;
            }
    
            .o_bg-left {
                background-position: 0 0;
                background-repeat: no-repeat;
            }
    
            @media (max-width: 649px) {
                .o_col-full {
                    max-width: 100% !important;
                }
    
                .o_col-half {
                    max-width: 50% !important;
                }
    
                .o_hide-lg {
                    display: inline-block !important;
                    font-size: inherit !important;
                    max-height: none !important;
                    line-height: inherit !important;
                    overflow: visible !important;
                    width: auto !important;
                    visibility: visible !important;
                }
    
                .o_hide-xs,
                .o_hide-xs.o_col_i {
                    display: none !important;
                    font-size: 0 !important;
                    max-height: 0 !important;
                    width: 0 !important;
                    line-height: 0 !important;
                    overflow: hidden !important;
                    visibility: hidden !important;
                    height: 0 !important;
                }
    
                .o_xs-center {
                    text-align: center !important;
                }
    
                .o_xs-left {
                    text-align: left !important;
                }
    
                .o_xs-right {
                    text-align: left !important;
                }
    
                table.o_xs-left {
                    margin-left: 0 !important;
                    margin-right: auto !important;
                    float: none !important;
                }
    
                table.o_xs-right {
                    margin-left: auto !important;
                    margin-right: 0 !important;
                    float: none !important;
                }
    
                table.o_xs-center {
                    margin-left: auto !important;
                    margin-right: auto !important;
                    float: none !important;
                }
    
                h1.o_heading {
                    font-size: 32px !important;
                    line-height: 41px !important;
                }
    
                h2.o_heading {
                    font-size: 26px !important;
                    line-height: 37px !important;
                }
    
                h3.o_heading {
                    font-size: 20px !important;
                    line-height: 30px !important;
                }
    
                .o_xs-py-md {
                    padding-top: 24px !important;
                    padding-bottom: 24px !important;
                }
    
                .o_xs-pt-xs {
                    padding-top: 8px !important;
                }
    
                .o_xs-pb-xs {
                    padding-bottom: 8px !important;
                }
            }
    
            @media screen {
                @font-face {
                    font-family: 'Roboto';
                    font-style: normal;
                    font-weight: 400;
                    src: local("Roboto"), local("Roboto-Regular"), url(https://fonts.gstatic.com/s/roboto/v18/KFOmCnqEu92Fr1Mu7GxKOzY.woff2) format("woff2");
                    unicode-range: U+0100-024F, U+0259, U+1E00-1EFF, U+2020, U+20A0-20AB, U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF;
                }
    
                @font-face {
                    font-family: 'Roboto';
                    font-style: normal;
                    font-weight: 400;
                    src: local("Roboto"), local("Roboto-Regular"), url(https://fonts.gstatic.com/s/roboto/v18/KFOmCnqEu92Fr1Mu4mxK.woff2) format("woff2");
                    unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
                }
    
                @font-face {
                    font-family: 'Roboto';
                    font-style: normal;
                    font-weight: 700;
                    src: local("Roboto Bold"), local("Roboto-Bold"), url(https://fonts.gstatic.com/s/roboto/v18/KFOlCnqEu92Fr1MmWUlfChc4EsA.woff2) format("woff2");
                    unicode-range: U+0100-024F, U+0259, U+1E00-1EFF, U+2020, U+20A0-20AB, U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF;
                }
    
                @font-face {
                    font-family: 'Roboto';
                    font-style: normal;
                    font-weight: 700;
                    src: local("Roboto Bold"), local("Roboto-Bold"), url(https://fonts.gstatic.com/s/roboto/v18/KFOlCnqEu92Fr1MmWUlfBBc4.woff2) format("woff2");
                    unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
                }
    
                .o_sans,
                .o_heading {
                    font-family: "Roboto", sans-serif !important;
                }
    
                .o_heading,
                strong,
                b {
                    font-weight: 700 !important;
                }
    
                a[x-apple-data-detectors] {
                    color: inherit !important;
                    text-decoration: none !important;
                }
            }
        </style>
    </head>
    <body class="o_body o_bg-white">
        <!-- preview-text -->
        <table width="100%" cellspacing="0" cellpadding="0" border="0" role="presentation">
            <tbody>
                <tr>
                    <td class="o_hide" align="center">Experience hassle-free account recovery through our user-friendly password reset process, safeguarding your financial information.</td>
                </tr>
            </tbody>
        </table>
        <!-- header-white-link -->
        <table width="100%" cellspacing="0" cellpadding="0" border="0" role="presentation">
            <tbody>
                <tr>
                    <td class="o_re o_bg-white o_px o_pb-md">
                        <!--[if mso]><table cellspacing="0" cellpadding="0" border="0" role="presentation"><tbody><tr><td width="200" align="left" valign="top" style="padding:0px 8px;"><![endif]-->
                        <div class="o_col o_col-2">
                            <div style="font-size: 24px; line-height: 24px; height: 24px;">&nbsp; </div>
                            <div class="o_px-xs o_sans o_text o_left o_xs-center">
                                <p><a class="o_text-primary" href="https://fintechapp.satva.solutions"><img src="https://adma.tmsimg.com/assets/s57394_ll_h9_ad.png?w=360&h=270?w=100" width="150" height="40" alt="Fintech App Logo" style="max-width: 400px;"></a></p>
                            </div>
                        </div>
                        <!--[if mso]></td><td width="400" align="right" valign="top" style="padding:0px 8px;"><![endif]-->
                        <div class="o_col o_col-4">
                            <div style="font-size: 22px; line-height: 22px; height: 22px;">&nbsp; </div>
                        </div>
                        <!--[if mso]></td></tr></table><![endif]-->
                    </td>
                </tr>
            </tbody>
        </table>
        <!-- hero-icon-lines -->
        <table width="100%" cellspacing="0" cellpadding="0" border="0" role="presentation">
            <tbody>
                <tr>
                    <td class="o_bg-ultra_light o_px-md o_py-xl o_xs-py-md" align="center">
                        <!--[if mso]><table width="584" cellspacing="0" cellpadding="0" border="0" role="presentation"><tbody><tr><td align="center"><![endif]-->
                        <div class="o_col-6s o_sans o_text-md o_text-light o_center">
                            <table class="o_center" role="presentation" cellspacing="0" cellpadding="0" border="0">
                                <tbody>
                                    <tr>
                                        <td class="o_bb-primary" height="40" width="32">&nbsp; </td>
                                        <td rowspan="2" class="o_sans o_text o_text-secondary o_px o_py" align="center">
                                            <img src="https://cdn-icons-png.flaticon.com/128/1000/1000948.png" width="48" height="48" alt="" style="max-width: 48px;">
                                        </td>
                                        <td class="o_bb-primary" height="40" width="32">&nbsp; </td>
                                    </tr>
                                    <tr>
                                        <td height="40">&nbsp; </td>
                                        <td height="40">&nbsp; </td>
                                    </tr>
                                    <tr>
                                        <td style="font-size: 8px; line-height: 8px; height: 8px;">&nbsp; </td>
                                        <td style="font-size: 8px; line-height: 8px; height: 8px;">&nbsp; </td>
                                    </tr>
                                </tbody>
                            </table>
                            <h2 class="o_heading o_text-dark o_mb-xxs">Forgot Your Password?</h2>
                            <p>Your password is your key to endless wonders! Don't worry we will help you reset your password.</p>
                        </div>
                        <!--[if mso]></td></tr></table><![endif]-->
                    </td>
                </tr>
            </tbody>
        </table>
        <!-- spacer -->
        <table width="100%" cellspacing="0" cellpadding="0" border="0" role="presentation">
            <tbody>
                <tr>
                    <td class="o_bg-white" style="font-size: 24px; line-height: 24px; height: 24px;">&nbsp; </td>
                </tr>
            </tbody>
        </table>
        <!-- content -->
        <table width="100%" cellspacing="0" cellpadding="0" border="0" role="presentation">
            <tbody>
                <tr>
                    <td class="o_bg-white o_px-md o_py" align="center">
                        <!--[if mso]><table width="584" cellspacing="0" cellpadding="0" border="0" role="presentation"><tbody><tr><td align="center"><![endif]-->
                        <div class="o_col-6s o_sans o_text o_text-secondary o_center">
                        <p><b>Hey ${fullName},</b></p>
                            <p>Please click on the button below to reset your password. If you did not initiate this request, please ignore this mail.</p>
                        </div>
                        <!--[if mso]></td></tr></table><![endif]-->
                    </td>
                </tr>
            </tbody>
        </table>
        <!-- button-primary -->
        <table width="100%" cellspacing="0" cellpadding="0" border="0" role="presentation">
            <tbody>
                <tr>
                    <td class="o_bg-white o_px-md o_py-xs" align="center">
                        <table align="center" cellspacing="0" cellpadding="0" border="0" role="presentation">
                            <tbody>
                                <tr>
                                    <td width="300" class="o_btn o_bg-primary o_br o_heading o_text" align="center">
                                        <a class="o_text-white" href="${url}" style="color:white;">Reset My Password</a>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </td>
                </tr>
            </tbody>
        </table>
        <!-- spacer-lg -->
        <table width="100%" cellspacing="0" cellpadding="0" border="0" role="presentation">
            <tbody>
                <tr>
                    <td class="o_bg-white" style="font-size: 48px; line-height: 48px; height: 48px;">&nbsp; </td>
                </tr>
            </tbody>
        </table>
        <!-- footer-white-2cols -->
        <table width="100%" cellspacing="0" cellpadding="0" border="0" role="presentation">
            <tbody>
                <tr>
                    <td class="o_re o_bg-white o_px o_pb-lg o_bt-light" align="center">
                        <!--[if mso]><table cellspacing="0" cellpadding="0" border="0" role="presentation"><tbody><tr><td width="200" align="left" valign="top" style="padding:0px 8px;"><![endif]-->
                        <div class="o_col o_col-4">
                            <div style="font-size: 32px; line-height: 32px; height: 32px;">&nbsp; </div>
                            <div class="o_px-xs o_sans o_text-xs o_text-light o_left o_xs-center">
                                <p class="o_mb-xs">©2023 Fintech App. All rights reserved.</p>
                                <p>
                                    <a class="o_text-light o_underline" href="https://fintechapp.satva.solutions">Contact Us</a> <span class="o_hide-xs">&nbsp; • &nbsp;</span><br class="o_hide-lg">
                                </p>
                            </div>
                        </div>
                        <!--[if mso]></td><td width="400" align="right" valign="top" style="padding:0px 8px;"><![endif]-->
                        <div class="o_col o_col-2">
                            <div style="font-size: 32px; line-height: 32px; height: 32px;">&nbsp; </div>
                            <div class="o_px-xs o_sans o_text-xs o_text-light o_right o_xs-center">
                                <p>
                                    <a class="o_text-light" href="https://www.facebook.com/login/"><img src="https://cdn-icons-png.flaticon.com/128/3955/3955011.png" width="36" height="36" alt="fb" style="max-width: 36px;"></a><span> &nbsp;</span>
                                    <a class="o_text-light" href="https://www.instagram.com/accounts/login/"><img src="https://cdn-icons-png.flaticon.com/128/3955/3955024.png" width="36" height="36" alt="ig" style="max-width: 36px;"></a><span> &nbsp;</span>
                                </p>
                            </div>
                        </div>
                        <!--[if mso]></td></tr></table><![endif]-->
                        <div class="o_hide-xs" style="font-size: 64px; line-height: 64px; height: 64px;">&nbsp; </div>
                    </td>
                </tr>
            </tbody>
        </table>
    </body>
    </html>`;
  };
  
  // Send email to user when he subscribe to zoho
  export const getRegisterEmailTemplate = (data: any) => {
    const { fullName, url } = data;
  
    return `
    <!DOCTYPE html>
              <html lang="en">
                  <head>
                          <meta charset="UTF-8" />
                          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                          <title>Browser</title>
                  </head>
                  <body>
  
                    <div style="width:100%; min-height:60vh;display:block; background-color:#f8f1e9 !important; padding : 200px 0px; font-family:Lexend">
                          <div class="my-card" style="background-color:#fff; border:2px solid #e0e0eb; padding:30px; max-width:470px; border-radius:15px; margin:auto">
                              <div class="card-header">
                                  <img src="https://costallocationspro.s3.amazonaws.com/image/cap-logo.png" width="200"/>
                              </div>
                              <div class="card-body">
                                      <p style="font-weight:600; font-size:20px">Welcome to CostAllocation Pro.</p>
                                      <p>Hi <b>${fullName}</b>,</p>
                    <p>We hope this email finds you well. On behalf of the entire team at <b>CostAllocation Pro</b>, we wanted to thank you for subscribing to our portal.</p> 
                                      <p>Please generate password for your account to access our portal using below link : </p>
                                      <br/>
                                      <p style="margin:30px 0px"><button class="reset-button" style="border:none;border-radius:20px;padding:8px 20px;background-color:#000;"><a href='${url}' style="color:white;text-decoration:none;">Generate Password<a/></button> 
                                      </p>
                              </div>
                          </div>
                      </div>
                  </body>
              </html>
    `;
  };
  
  // Send email to user when he subscribe to zoho
  export const getRegisterEmailTemplateInfra = (data: any) => {
    const { fullName, url, email } = data;
    return `
      <!doctype html>
    <html lang="en">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
        <meta name="x-apple-disable-message-reformatting">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <title>Account Verification</title>
        <!-- build:maincss -->
        <style type="text/css">
    
            .o_sans,
            .o_heading {
                font-family: Helvetica, Arial, sans-serif;
            }
    
            .o_heading {
                font-weight: bold;
            }
    
            .o_sans,
            .o_heading,
            .o_sans p,
            .o_sans li {
                margin-top: 0px;
                margin-bottom: 0px;
            }
    
            a {
                text-decoration: none;
                outline: none;
            }
    
            .o_underline {
                text-decoration: underline;
            }
    
            .o_linethrough {
                text-decoration: line-through;
            }
    
            .o_nowrap {
                white-space: nowrap;
            }
    
            .o_caps {
                text-transform: uppercase;
                letter-spacing: 1px;
            }
    
            .o_nowrap {
                white-space: nowrap;
            }
    
            .o_text-xxs {
                font-size: 12px;
                line-height: 19px;
            }
    
            .o_text-xs {
                font-size: 14px;
                line-height: 21px;
            }
    
            .o_text {
                font-size: 16px;
                line-height: 24px;
            }
    
            .o_text-md {
                font-size: 19px;
                line-height: 28px;
            }
    
            .o_text-lg {
                font-size: 24px;
                line-height: 30px;
            }
    
            h1.o_heading {
                font-size: 36px;
                line-height: 47px;
            }
    
            h2.o_heading {
                font-size: 30px;
                line-height: 39px;
            }
    
            h3.o_heading {
                font-size: 24px;
                line-height: 31px;
            }
    
            h4.o_heading {
                font-size: 18px;
                line-height: 23px;
            }
    
            body,
            .e_body {
                width: 100%;
                margin: 0px;
                padding: 0px;
                -webkit-text-size-adjust: 100%;
                -ms-text-size-adjust: 100%;
            }
    
            .o_re {
                font-size: 0;
                vertical-align: top;
            }
    
            .o_block {
                max-width: 632px;
                margin: 0 auto;
            }
    
            .o_block-lg {
                max-width: 800px;
                margin: 0 auto;
            }
    
            .o_block-xs {
                max-width: 432px;
                margin: 0 auto;
            }
    
            .o_col,
            .o_col_i {
                display: inline-block;
                vertical-align: top;
            }
    
            .o_col {
                width: 100%;
            }
    
            .o_col-1 {
                max-width: 100px;
            }
    
            .o_col-o {
                max-width: 132px;
            }
    
            .o_col-2 {
                max-width: 200px;
            }
    
            .o_col-3 {
                max-width: 300px;
            }
    
            .o_col-4 {
                max-width: 400px;
            }
    
            .o_col-oo {
                max-width: 468px;
            }
    
            .o_col-5 {
                max-width: 500px;
            }
    
            .o_col-6s {
                max-width: 584px;
            }
    
            .o_col-6 {
                max-width: 600px;
            }
    
            img {
                -ms-interpolation-mode: bicubic;
                vertical-align: middle;
                border: 0;
                line-height: 100%;
                height: auto;
                outline: none;
                text-decoration: none;
            }
    
            .o_img-full {
                width: 100%;
            }
    
            .o_inline {
                display: inline-block;
            }
    
            .o_btn {
                mso-padding-alt: 12px 24px;
            }
    
                .o_btn a {
                    display: block;
                    padding: 12px 24px;
                    mso-text-raise: 3px;
                }
    
            .o_btn-o {
                mso-padding-alt: 8px 20px;
            }
    
                .o_btn-o a {
                    display: block;
                    padding: 8px 20px;
                    mso-text-raise: 3px;
                }
    
            .o_btn-xs {
                mso-padding-alt: 7px 16px;
            }
    
                .o_btn-xs a {
                    display: block;
                    padding: 7px 16px;
                    mso-text-raise: 3px;
                }
    
            .o_btn-b {
                mso-padding-alt: 7px 8px;
            }
    
                .o_btn-b a {
                    display: block;
                    padding: 7px 8px;
                    font-weight: bold;
                }
    
                .o_btn-b span {
                    mso-text-raise: 6px;
                    display: inline;
                }
    
            .img_fix {
                mso-text-raise: 6px;
                display: inline;
            }
    
            .o_bg-light {
                background-color: #dbe5ea;
            }
    
            .o_bg-ultra_light {
                background-color: #ebf5fa;
            }
    
            .o_bg-white {
                background-color: #ffffff;
            }
    
            .o_bg-dark {
                background-color: #242b3d;
            }
    
            .o_bg-primary {
                background-color: #126de5;
            }
    
            .o_bg-secondary {
                background-color: #424651;
            }
    
            .o_bg-success {
                background-color: #0ec06e;
            }
    
            .o_text-primary,
            a.o_text-primary span,
            a.o_text-primary strong,
            .o_text-primary.o_link a {
                color: #126de5;
            }
    
            .o_text-secondary,
            a.o_text-secondary span,
            a.o_text-secondary strong,
            .o_text-secondary.o_link a {
                color: #424651;
            }
    
            .o_text-dark,
            a.o_text-dark span,
            a.o_text-dark strong,
            .o_text-dark.o_link a {
                color: #242b3d;
            }
    
            .o_text-dark_light,
            a.o_text-dark_light span,
            a.o_text-dark_light strong,
            .o_text-dark_light.o_link a {
                color: #a0a3ab;
            }
    
            .o_text-white,
            a.o_text-white span,
            a.o_text-white strong,
            .o_text-white.o_link a {
                color: #ffffff;
            }
    
            .o_text-light,
            a.o_text-light span,
            a.o_text-light strong,
            .o_text-light.o_link a {
                color: #82899a;
            }
    
            .o_text-success,
            a.o_text-success span,
            a.o_text-success strong,
            .o_text-success.o_link a {
                color: #0ec06e;
            }
    
            .o_b-primary {
                border: 2px solid #126de5;
            }
    
            .o_bb-primary {
                border-bottom: 1px solid #126de5;
            }
    
            .o_b-secondary {
                border: 2px solid #424651;
            }
    
            .o_bx-secondary {
                border: 1px solid #424651;
            }
    
            .o_bb-secondary {
                border-bottom: 1px solid #424651;
            }
    
            .o_b-dark {
                border: 2px solid #242b3d;
            }
    
            .o_b-light {
                border: 1px solid #d3dce0;
            }
    
            .o_bb-light {
                border-bottom: 1px solid #d3dce0;
            }
    
            .o_bt-light {
                border-top: 1px solid #d3dce0;
            }
    
            .o_br-light {
                border-right: 4px solid #d3dce0;
            }
    
            .o_bb-ultra_light {
                border-bottom: 1px solid #b6c0c7;
            }
    
            .o_bb-dark_light {
                border-bottom: 1px solid #4a5267;
            }
    
            .o_bt-dark_light {
                border-top: 1px solid #4a5267;
            }
    
            .o_b-white {
                border: 2px solid #ffffff;
            }
    
            .o_bb-white {
                border-bottom: 1px solid #ffffff;
            }
    
            .o_br {
                border-radius: 4px;
            }
    
            .o_br-t {
                border-radius: 4px 4px 0px 0px;
            }
    
            .o_br-b {
                border-radius: 0px 0px 4px 4px;
            }
    
            .o_br-l {
                border-radius: 4px 0px 0px 4px;
            }
    
            .o_br-r {
                border-radius: 0px 4px 4px 0px;
            }
    
            .o_br-max {
                border-radius: 96px;
            }
    
            .o_hide,
            .o_hide-lg {
                display: none;
                font-size: 0;
                max-height: 0;
                width: 0;
                line-height: 0;
                overflow: hidden;
                mso-hide: all;
                visibility: hidden;
            }
    
            .o_center {
                text-align: center;
            }
    
            table.o_center {
                margin-left: auto;
                margin-right: auto;
            }
    
            .o_left {
                text-align: left;
            }
    
            table.o_left {
                margin-left: 0;
                margin-right: auto;
            }
    
            .o_right {
                text-align: right;
            }
    
            table.o_right {
                margin-left: auto;
                margin-right: 0;
            }
    
            .o_px {
                padding-left: 16px;
                padding-right: 16px;
            }
    
            .o_px-xs {
                padding-left: 8px;
                padding-right: 8px;
            }
    
            .o_px-md {
                padding-left: 24px;
                padding-right: 24px;
            }
    
            .o_px-lg {
                padding-left: 32px;
                padding-right: 32px;
            }
    
            .o_py {
                padding-top: 16px;
                padding-bottom: 16px;
            }
    
            .o_py-xs {
                padding-top: 8px;
                padding-bottom: 8px;
            }
    
            .o_py-md {
                padding-top: 24px;
                padding-bottom: 24px;
            }
    
            .o_py-lg {
                padding-top: 32px;
                padding-bottom: 32px;
            }
    
            .o_py-xl {
                padding-top: 64px;
                padding-bottom: 64px;
            }
    
            .o_pt-xs {
                padding-top: 8px;
            }
    
            .o_pt {
                padding-top: 16px;
            }
    
            .o_pt-md {
                padding-top: 24px;
            }
    
            .o_pt-lg {
                padding-top: 32px;
            }
    
            .o_pb-xs {
                padding-bottom: 8px;
            }
    
            .o_pb {
                padding-bottom: 16px;
            }
    
            .o_pb-md {
                padding-bottom: 24px;
            }
    
            .o_pb-lg {
                padding-bottom: 32px;
            }
    
            .o_p-icon {
                padding: 12px;
            }
    
            .o_body .o_mb-xxs {
                margin-bottom: 4px;
            }
    
            .o_body .o_mb-xs {
                margin-bottom: 8px;
            }
    
            .o_body .o_mb {
                margin-bottom: 16px;
            }
    
            .o_body .o_mb-md {
                margin-bottom: 24px;
            }
    
            .o_body .o_mb-lg {
                margin-bottom: 32px;
            }
    
            .o_body .o_mt {
                margin-top: 16px;
            }
    
            .o_body .o_mt-md {
                margin-top: 24px;
            }
    
            .o_bg-center {
                background-position: 50% 0;
                background-repeat: no-repeat;
            }
    
            .o_bg-left {
                background-position: 0 0;
                background-repeat: no-repeat;
            }
    
            @media (max-width: 649px) {
                .o_col-full {
                    max-width: 100% !important;
                }
    
                .o_col-half {
                    max-width: 50% !important;
                }
    
                .o_hide-lg {
                    display: inline-block !important;
                    font-size: inherit !important;
                    max-height: none !important;
                    line-height: inherit !important;
                    overflow: visible !important;
                    width: auto !important;
                    visibility: visible !important;
                }
    
                .o_hide-xs,
                .o_hide-xs.o_col_i {
                    display: none !important;
                    font-size: 0 !important;
                    max-height: 0 !important;
                    width: 0 !important;
                    line-height: 0 !important;
                    overflow: hidden !important;
                    visibility: hidden !important;
                    height: 0 !important;
                }
    
                .o_xs-center {
                    text-align: center !important;
                }
    
                .o_xs-left {
                    text-align: left !important;
                }
    
                .o_xs-right {
                    text-align: left !important;
                }
    
                table.o_xs-left {
                    margin-left: 0 !important;
                    margin-right: auto !important;
                    float: none !important;
                }
    
                table.o_xs-right {
                    margin-left: auto !important;
                    margin-right: 0 !important;
                    float: none !important;
                }
    
                table.o_xs-center {
                    margin-left: auto !important;
                    margin-right: auto !important;
                    float: none !important;
                }
    
                h1.o_heading {
                    font-size: 32px !important;
                    line-height: 41px !important;
                }
    
                h2.o_heading {
                    font-size: 26px !important;
                    line-height: 37px !important;
                }
    
                h3.o_heading {
                    font-size: 20px !important;
                    line-height: 30px !important;
                }
    
                .o_xs-py-md {
                    padding-top: 24px !important;
                    padding-bottom: 24px !important;
                }
    
                .o_xs-pt-xs {
                    padding-top: 8px !important;
                }
    
                .o_xs-pb-xs {
                    padding-bottom: 8px !important;
                }
            }
    
            @media screen {
                @font-face {
                    font-family: 'Roboto';
                    font-style: normal;
                    font-weight: 400;
                    src: local("Roboto"), local("Roboto-Regular"), url(https://fonts.gstatic.com/s/roboto/v18/KFOmCnqEu92Fr1Mu7GxKOzY.woff2) format("woff2");
                    unicode-range: U+0100-024F, U+0259, U+1E00-1EFF, U+2020, U+20A0-20AB, U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF;
                }
    
                @font-face {
                    font-family: 'Roboto';
                    font-style: normal;
                    font-weight: 400;
                    src: local("Roboto"), local("Roboto-Regular"), url(https://fonts.gstatic.com/s/roboto/v18/KFOmCnqEu92Fr1Mu4mxK.woff2) format("woff2");
                    unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
                }
    
                @font-face {
                    font-family: 'Roboto';
                    font-style: normal;
                    font-weight: 700;
                    src: local("Roboto Bold"), local("Roboto-Bold"), url(https://fonts.gstatic.com/s/roboto/v18/KFOlCnqEu92Fr1MmWUlfChc4EsA.woff2) format("woff2");
                    unicode-range: U+0100-024F, U+0259, U+1E00-1EFF, U+2020, U+20A0-20AB, U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF;
                }
    
                @font-face {
                    font-family: 'Roboto';
                    font-style: normal;
                    font-weight: 700;
                    src: local("Roboto Bold"), local("Roboto-Bold"), url(https://fonts.gstatic.com/s/roboto/v18/KFOlCnqEu92Fr1MmWUlfBBc4.woff2) format("woff2");
                    unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
                }
    
                .o_sans,
                .o_heading {
                    font-family: "Roboto", sans-serif !important;
                }
    
                .o_heading,
                strong,
                b {
                    font-weight: 700 !important;
                }
    
                a[x-apple-data-detectors] {
                    color: inherit !important;
                    text-decoration: none !important;
                }
            }
    
    
    
        </style>
    </head>
    <body class="o_body o_bg-white">
        <!-- preview-text -->
        <table width="100%" cellspacing="0" cellpadding="0" border="0" role="presentation">
            <tbody>
                <tr>
                    <td class="o_hide" align="center">Fintech App: Transforming Financial Management. Discover streamlined financial control with our Fintech App</td>
                </tr>
            </tbody>
        </table>
        <!-- header -->
        <table width="100%" cellspacing="0" cellpadding="0" border="0" role="presentation">
            <tbody>
                <tr>
                    <td class="o_bg-white o_px-md o_py-md o_sans o_text">
                        <p><a class="o_text-white" href="https://fintechapp.satva.solutions"><img src="https://adma.tmsimg.com/assets/s57394_ll_h9_ad.png?w=360&h=270?w=100" width="150" height="40" alt="SyncTools" style="max-width: 400px;"></a></p>
                    
                    </td>
                </tr>
            </tbody>
        </table>
        <!-- hero-icon-lines -->
        <table width="100%" cellspacing="0" cellpadding="0" border="0" role="presentation">
            <tbody>
                <tr>
                    <td class="o_bg-ultra_light o_px-md o_py-xl o_xs-py-md" align="center">
                       
                        <div class="o_col-6s o_sans o_text-md o_text-light o_center">
                            <table class="o_center" role="presentation" cellspacing="0" cellpadding="0" border="0">
                                <tbody>
                                    <tr>
                                        <td class="o_bb-primary" height="40" width="32">&nbsp; </td>
                                        <td rowspan="2" class="o_sans o_text o_text-secondary o_px o_py" align="center">
                                            <img src="https://cdn-icons-png.flaticon.com/128/9068/9068642.png" width="48" height="48" alt="Email" style="max-width: 48px;">
                                           
                                        </td>
                                        <td class="o_bb-primary" height="40" width="32">&nbsp; </td>
                                    </tr>
                                    <tr>
                                        <td height="40">&nbsp; </td>
                                        <td height="40">&nbsp; </td>
                                    </tr>
                                    <tr>
                                        <td style="font-size: 8px; line-height: 8px; height: 8px;">&nbsp; </td>
                                        <td style="font-size: 8px; line-height: 8px; height: 8px;">&nbsp; </td>
                                    </tr>
                                </tbody>
                            </table>
                            <h2 class="o_heading o_text-dark o_mb-xxs">Verify E-mail Address</h2>
                        </div>
    
                    </td>
                </tr>
            </tbody>
        </table>
        <!-- spacer -->
        <table width="100%" cellspacing="0" cellpadding="0" border="0" role="presentation">
            <tbody>
                <tr>
                    <td class="o_bg-white" style="font-size: 24px; line-height: 24px; height: 24px;">&nbsp; </td>
                </tr>
            </tbody>
        </table>
        <!-- label-xs -->
        <table width="100%" cellspacing="0" cellpadding="0" border="0" role="presentation">
            <tbody>
                <tr>
                    <td class="o_bg-white o_px-md o_py o_sans o_text-xs o_text-light" align="center">
                        <p class="o_mb"><strong>E-mail Address</strong></p>
                        <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                            <tbody>
                                <tr>
                                    <td width="284" class="o_bg-ultra_light o_br o_text-xs o_sans o_px-xs o_py" align="center">
                                        <p class="o_text-dark"><strong style=" cursor: default; pointer-events: none;"> ${email}</strong></p>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </td>
                </tr>
            </tbody>
        </table>
        <!-- button-primary -->
        <table width="100%" cellspacing="0" cellpadding="0" border="0" role="presentation">
            <tbody>
                <tr>
                    <td class="o_bg-white o_px-md o_py-xs" align="center">
                        <table align="center" cellspacing="0" cellpadding="0" border="0" role="presentation">
                            <tbody>
                                <tr>
                                    <td width="300" class="o_btn o_bg-primary o_br o_heading o_text" align="center">
                                        <a class="o_text-white" style="cursor: pointer; color: white;" target="_blank" href="${url}">Verify My E-mail Address</a>
                                        <!--<a class="o_text-white" style="cursor:pointer;" href="${url}">Verify My E-mail Address</a>-->
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </td>
                </tr>
            </tbody>
        </table>
        <!-- spacer -->
        <table width="100%" cellspacing="0" cellpadding="0" border="0" role="presentation">
            <tbody>
                <tr>
                    <td class="o_bg-white" style="font-size: 24px; line-height: 24px; height: 24px;">&nbsp; </td>
                </tr>
            </tbody>
        </table>
        <!-- content -->
        <table width="100%" cellspacing="0" cellpadding="0" border="0" role="presentation">
            <tbody>
                <tr>
                    <td class="o_bg-white o_px-md o_py" align="center">
                        <!--[if mso]><table width="584" cellspacing="0" cellpadding="0" border="0" role="presentation"><tbody><tr><td align="center"><![endif]-->
                        <div class="o_col-6s o_sans o_text o_text-secondary o_center">
                            <p>Hi <b> ${fullName},</b>
                                We're thrilled to have you as part of our mystical community. Your success is our magic, and we can't wait to see your ecommerce dreams come true.<br><br>
    
                                If you encounter any spells or need a wizard's help with the verification process, our support team is always at your service. Just shoot us an owl – um, we mean an email – at  support@yourfintechapp.com
                            </p>
                        </div>
                        <!--[if mso]></td></tr></table><![endif]-->
                    </td>
                </tr>
            </tbody>
        </table>
        <!-- spacer-lg -->
        <table width="100%" cellspacing="0" cellpadding="0" border="0" role="presentation">
            <tbody>
                <tr>
                    <td class="o_bg-white" style="font-size: 48px; line-height: 48px; height: 48px;">&nbsp; </td>
                </tr>
            </tbody>
        </table>
        <!-- footer-white -->
        <table width="100%" cellspacing="0" cellpadding="0" border="0" role="presentation">
            <tbody>
                <tr>
                    <td class="o_bg-white o_px-md o_py-lg o_bt-light" align="center">
                        <div class="o_col-6s o_sans o_text-xs o_text-light">
    
                        
                            <p class="o_mb"><a class="o_text-primary" href="https://fintechapp.satva.solutions"><img src="https://logo.clearbit.com/animalplanet.com" width="36" height="36" alt="SyncTools" style="max-width: 36px;"></a></p>
                            <p class="o_mb">©2023 Fintech App</p>
                            <p>
                                <a class="o_text-light o_underline" href="https://fintechapp.satva.solutions">Contact Us</a> <span class="o_hide-xs">&nbsp; • &nbsp;</span><br class="o_hide-lg">
                                <a class="o_text-light o_underline" href="https://fintechapp.satva.solutions">Help Centre</a> <span class="o_hide-xs">&nbsp; • &nbsp;</span><br class="o_hide-lg">
                            </p>
                        </div>
                        <!--[if mso]></td></tr></table><![endif]-->
                        <div class="o_hide-xs" style="font-size: 64px; line-height: 64px; height: 64px;">&nbsp; </div>
                    </td>
                </tr>
            </tbody>
        </table>
    </body>
    </html>
      `;
  };
  
  // Send email to user on invitation when he is already exist
  export const getInvitationEmailUserExistTemplate = (data: any) => {
    const { email, companyName, url } = data;
    return `
    <!doctype html>
  <html lang="en">
  <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
      <meta name="x-apple-disable-message-reformatting">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <title>Account Password Reset</title>
  
      <style>
          .o_sans,
          .o_heading {
              font-family: Helvetica, Arial, sans-serif;
          }
  
          .o_heading {
              font-weight: bold;
          }
  
          .o_sans,
          .o_heading,
          .o_sans p,
          .o_sans li {
              margin-top: 0px;
              margin-bottom: 0px;
          }
  
          a {
              text-decoration: none;
              outline: none;
          }
  
          .o_underline {
              text-decoration: underline;
          }
  
          .o_linethrough {
              text-decoration: line-through;
          }
  
          .o_nowrap {
              white-space: nowrap;
          }
  
          .o_caps {
              text-transform: uppercase;
              letter-spacing: 1px;
          }
  
          .o_nowrap {
              white-space: nowrap;
          }
  
          .o_text-xxs {
              font-size: 12px;
              line-height: 19px;
          }
  
          .o_text-xs {
              font-size: 14px;
              line-height: 21px;
          }
  
          .o_text {
              font-size: 16px;
              line-height: 24px;
          }
  
          .o_text-md {
              font-size: 19px;
              line-height: 28px;
          }
  
          .o_text-lg {
              font-size: 24px;
              line-height: 30px;
          }
  
          h1.o_heading {
              font-size: 36px;
              line-height: 47px;
          }
  
          h2.o_heading {
              font-size: 30px;
              line-height: 39px;
          }
  
          h3.o_heading {
              font-size: 24px;
              line-height: 31px;
          }
  
          h4.o_heading {
              font-size: 18px;
              line-height: 23px;
          }
  
          body,
          .e_body {
              width: 100%;
              margin: 0px;
              padding: 0px;
              -webkit-text-size-adjust: 100%;
              -ms-text-size-adjust: 100%;
          }
  
          .o_re {
              font-size: 0;
              vertical-align: top;
          }
  
          .o_block {
              max-width: 632px;
              margin: 0 auto;
          }
  
          .o_block-lg {
              max-width: 800px;
              margin: 0 auto;
          }
  
          .o_block-xs {
              max-width: 432px;
              margin: 0 auto;
          }
  
          .o_col,
          .o_col_i {
              display: inline-block;
              vertical-align: top;
          }
  
          .o_col {
              width: 100%;
          }
  
          .o_col-1 {
              max-width: 100px;
          }
  
          .o_col-o {
              max-width: 132px;
          }
  
          .o_col-2 {
              max-width: 200px;
          }
  
          .o_col-3 {
              max-width: 300px;
          }
  
          .o_col-4 {
              max-width: 400px;
          }
  
          .o_col-oo {
              max-width: 468px;
          }
  
          .o_col-5 {
              max-width: 500px;
          }
  
          .o_col-6s {
              max-width: 584px;
          }
  
          .o_col-6 {
              max-width: 600px;
          }
  
          img {
              -ms-interpolation-mode: bicubic;
              vertical-align: middle;
              border: 0;
              line-height: 100%;
              height: auto;
              outline: none;
              text-decoration: none;
          }
  
          .o_img-full {
              width: 100%;
          }
  
          .o_inline {
              display: inline-block;
          }
  
          .o_btn {
              mso-padding-alt: 12px 24px;
          }
  
              .o_btn a {
                  display: block;
                  padding: 12px 24px;
                  mso-text-raise: 3px;
              }
  
          .o_btn-o {
              mso-padding-alt: 8px 20px;
          }
  
              .o_btn-o a {
                  display: block;
                  padding: 8px 20px;
                  mso-text-raise: 3px;
              }
  
          .o_btn-xs {
              mso-padding-alt: 7px 16px;
          }
  
              .o_btn-xs a {
                  display: block;
                  padding: 7px 16px;
                  mso-text-raise: 3px;
              }
  
          .o_btn-b {
              mso-padding-alt: 7px 8px;
          }
  
              .o_btn-b a {
                  display: block;
                  padding: 7px 8px;
                  font-weight: bold;
              }
  
              .o_btn-b span {
                  mso-text-raise: 6px;
                  display: inline;
              }
  
          .img_fix {
              mso-text-raise: 6px;
              display: inline;
          }
  
          .o_bg-light {
              background-color: #dbe5ea;
          }
  
          .o_bg-ultra_light {
              background-color: #ebf5fa;
          }
  
          .o_bg-white {
              background-color: #ffffff;
          }
  
          .o_bg-dark {
              background-color: #242b3d;
          }
  
          .o_bg-primary {
              background-color: #126de5;
          }
  
          .o_bg-secondary {
              background-color: #424651;
          }
  
          .o_bg-success {
              background-color: #0ec06e;
          }
  
          .o_text-primary,
          a.o_text-primary span,
          a.o_text-primary strong,
          .o_text-primary.o_link a {
              color: #126de5;
          }
  
          .o_text-secondary,
          a.o_text-secondary span,
          a.o_text-secondary strong,
          .o_text-secondary.o_link a {
              color: #424651;
          }
  
          .o_text-dark,
          a.o_text-dark span,
          a.o_text-dark strong,
          .o_text-dark.o_link a {
              color: #242b3d;
          }
  
          .o_text-dark_light,
          a.o_text-dark_light span,
          a.o_text-dark_light strong,
          .o_text-dark_light.o_link a {
              color: #a0a3ab;
          }
  
          .o_text-white,
          a.o_text-white span,
          a.o_text-white strong,
          .o_text-white.o_link a {
              color: #ffffff;
          }
  
          .o_text-light,
          a.o_text-light span,
          a.o_text-light strong,
          .o_text-light.o_link a {
              color: #82899a;
          }
  
          .o_text-success,
          a.o_text-success span,
          a.o_text-success strong,
          .o_text-success.o_link a {
              color: #0ec06e;
          }
  
          .o_b-primary {
              border: 2px solid #126de5;
          }
  
          .o_bb-primary {
              border-bottom: 1px solid #126de5;
          }
  
          .o_b-secondary {
              border: 2px solid #424651;
          }
  
          .o_bx-secondary {
              border: 1px solid #424651;
          }
  
          .o_bb-secondary {
              border-bottom: 1px solid #424651;
          }
  
          .o_b-dark {
              border: 2px solid #242b3d;
          }
  
          .o_b-light {
              border: 1px solid #d3dce0;
          }
  
          .o_bb-light {
              border-bottom: 1px solid #d3dce0;
          }
  
          .o_bt-light {
              border-top: 1px solid #d3dce0;
          }
  
          .o_br-light {
              border-right: 4px solid #d3dce0;
          }
  
          .o_bb-ultra_light {
              border-bottom: 1px solid #b6c0c7;
          }
  
          .o_bb-dark_light {
              border-bottom: 1px solid #4a5267;
          }
  
          .o_bt-dark_light {
              border-top: 1px solid #4a5267;
          }
  
          .o_b-white {
              border: 2px solid #ffffff;
          }
  
          .o_bb-white {
              border-bottom: 1px solid #ffffff;
          }
  
          .o_br {
              border-radius: 4px;
          }
  
          .o_br-t {
              border-radius: 4px 4px 0px 0px;
          }
  
          .o_br-b {
              border-radius: 0px 0px 4px 4px;
          }
  
          .o_br-l {
              border-radius: 4px 0px 0px 4px;
          }
  
          .o_br-r {
              border-radius: 0px 4px 4px 0px;
          }
  
          .o_br-max {
              border-radius: 96px;
          }
  
          .o_hide,
          .o_hide-lg {
              display: none;
              font-size: 0;
              max-height: 0;
              width: 0;
              line-height: 0;
              overflow: hidden;
              mso-hide: all;
              visibility: hidden;
          }
  
          .o_center {
              text-align: center;
          }
  
          table.o_center {
              margin-left: auto;
              margin-right: auto;
          }
  
          .o_left {
              text-align: left;
          }
  
          table.o_left {
              margin-left: 0;
              margin-right: auto;
          }
  
          .o_right {
              text-align: right;
          }
  
          table.o_right {
              margin-left: auto;
              margin-right: 0;
          }
  
          .o_px {
              padding-left: 16px;
              padding-right: 16px;
          }
  
          .o_px-xs {
              padding-left: 8px;
              padding-right: 8px;
          }
  
          .o_px-md {
              padding-left: 24px;
              padding-right: 24px;
          }
  
          .o_px-lg {
              padding-left: 32px;
              padding-right: 32px;
          }
  
          .o_py {
              padding-top: 16px;
              padding-bottom: 16px;
          }
  
          .o_py-xs {
              padding-top: 8px;
              padding-bottom: 8px;
          }
  
          .o_py-md {
              padding-top: 24px;
              padding-bottom: 24px;
          }
  
          .o_py-lg {
              padding-top: 32px;
              padding-bottom: 32px;
          }
  
          .o_py-xl {
              padding-top: 64px;
              padding-bottom: 64px;
          }
  
          .o_pt-xs {
              padding-top: 8px;
          }
  
          .o_pt {
              padding-top: 16px;
          }
  
          .o_pt-md {
              padding-top: 24px;
          }
  
          .o_pt-lg {
              padding-top: 32px;
          }
  
          .o_pb-xs {
              padding-bottom: 8px;
          }
  
          .o_pb {
              padding-bottom: 16px;
          }
  
          .o_pb-md {
              padding-bottom: 24px;
          }
  
          .o_pb-lg {
              padding-bottom: 32px;
          }
  
          .o_p-icon {
              padding: 12px;
          }
  
          .o_body .o_mb-xxs {
              margin-bottom: 4px;
          }
  
          .o_body .o_mb-xs {
              margin-bottom: 8px;
          }
  
          .o_body .o_mb {
              margin-bottom: 16px;
          }
  
          .o_body .o_mb-md {
              margin-bottom: 24px;
          }
  
          .o_body .o_mb-lg {
              margin-bottom: 32px;
          }
  
          .o_body .o_mt {
              margin-top: 16px;
          }
  
          .o_body .o_mt-md {
              margin-top: 24px;
          }
  
          .o_bg-center {
              background-position: 50% 0;
              background-repeat: no-repeat;
          }
  
          .o_bg-left {
              background-position: 0 0;
              background-repeat: no-repeat;
          }
  
          @media (max-width: 649px) {
              .o_col-full {
                  max-width: 100% !important;
              }
  
              .o_col-half {
                  max-width: 50% !important;
              }
  
              .o_hide-lg {
                  display: inline-block !important;
                  font-size: inherit !important;
                  max-height: none !important;
                  line-height: inherit !important;
                  overflow: visible !important;
                  width: auto !important;
                  visibility: visible !important;
              }
  
              .o_hide-xs,
              .o_hide-xs.o_col_i {
                  display: none !important;
                  font-size: 0 !important;
                  max-height: 0 !important;
                  width: 0 !important;
                  line-height: 0 !important;
                  overflow: hidden !important;
                  visibility: hidden !important;
                  height: 0 !important;
              }
  
              .o_xs-center {
                  text-align: center !important;
              }
  
              .o_xs-left {
                  text-align: left !important;
              }
  
              .o_xs-right {
                  text-align: left !important;
              }
  
              table.o_xs-left {
                  margin-left: 0 !important;
                  margin-right: auto !important;
                  float: none !important;
              }
  
              table.o_xs-right {
                  margin-left: auto !important;
                  margin-right: 0 !important;
                  float: none !important;
              }
  
              table.o_xs-center {
                  margin-left: auto !important;
                  margin-right: auto !important;
                  float: none !important;
              }
  
              h1.o_heading {
                  font-size: 32px !important;
                  line-height: 41px !important;
              }
  
              h2.o_heading {
                  font-size: 26px !important;
                  line-height: 37px !important;
              }
  
              h3.o_heading {
                  font-size: 20px !important;
                  line-height: 30px !important;
              }
  
              .o_xs-py-md {
                  padding-top: 24px !important;
                  padding-bottom: 24px !important;
              }
  
              .o_xs-pt-xs {
                  padding-top: 8px !important;
              }
  
              .o_xs-pb-xs {
                  padding-bottom: 8px !important;
              }
          }
  
          @media screen {
              @font-face {
                  font-family: 'Roboto';
                  font-style: normal;
                  font-weight: 400;
                  src: local("Roboto"), local("Roboto-Regular"), url(https://fonts.gstatic.com/s/roboto/v18/KFOmCnqEu92Fr1Mu7GxKOzY.woff2) format("woff2");
                  unicode-range: U+0100-024F, U+0259, U+1E00-1EFF, U+2020, U+20A0-20AB, U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF;
              }
  
              @font-face {
                  font-family: 'Roboto';
                  font-style: normal;
                  font-weight: 400;
                  src: local("Roboto"), local("Roboto-Regular"), url(https://fonts.gstatic.com/s/roboto/v18/KFOmCnqEu92Fr1Mu4mxK.woff2) format("woff2");
                  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
              }
  
              @font-face {
                  font-family: 'Roboto';
                  font-style: normal;
                  font-weight: 700;
                  src: local("Roboto Bold"), local("Roboto-Bold"), url(https://fonts.gstatic.com/s/roboto/v18/KFOlCnqEu92Fr1MmWUlfChc4EsA.woff2) format("woff2");
                  unicode-range: U+0100-024F, U+0259, U+1E00-1EFF, U+2020, U+20A0-20AB, U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF;
              }
  
              @font-face {
                  font-family: 'Roboto';
                  font-style: normal;
                  font-weight: 700;
                  src: local("Roboto Bold"), local("Roboto-Bold"), url(https://fonts.gstatic.com/s/roboto/v18/KFOlCnqEu92Fr1MmWUlfBBc4.woff2) format("woff2");
                  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
              }
  
              .o_sans,
              .o_heading {
                  font-family: "Roboto", sans-serif !important;
              }
  
              .o_heading,
              strong,
              b {
                  font-weight: 700 !important;
              }
  
              a[x-apple-data-detectors] {
                  color: inherit !important;
                  text-decoration: none !important;
              }
          }
      </style>
  </head>
  <body class="o_body o_bg-white">
      <!-- preview-text -->
      <table width="100%" cellspacing="0" cellpadding="0" border="0" role="presentation">
          <tbody>
              <tr>
                  <td class="o_hide" align="center">The digital realm awaits your presence. Unveil the mysteries that lie into our cyber domain.</td>
              </tr>
          </tbody>
      </table>
      <!-- header-white-link -->
      <table width="100%" cellspacing="0" cellpadding="0" border="0" role="presentation">
          <tbody>
              <tr>
                  <td class="o_re o_bg-white o_px o_pb-md">
                      <!--[if mso]><table cellspacing="0" cellpadding="0" border="0" role="presentation"><tbody><tr><td width="200" align="left" valign="top" style="padding:0px 8px;"><![endif]-->
                      <div class="o_col o_col-2">
                          <div style="font-size: 24px; line-height: 24px; height: 24px;">&nbsp; </div>
                          <div class="o_px-xs o_sans o_text o_left o_xs-center">
                              <p><a class="o_text-primary" href="https://fintechapp.satva.solutions"><img src="https://adma.tmsimg.com/assets/s57394_ll_h9_ad.png?w=360&h=270?w=100" width="150" height="40" alt="Fintech App Logo" style="max-width: 400px;"></a></p>
                          </div>
                      </div>
                      <!--[if mso]></td><td width="400" align="right" valign="top" style="padding:0px 8px;"><![endif]-->
                      <div class="o_col o_col-4">
                          <div style="font-size: 22px; line-height: 22px; height: 22px;">&nbsp; </div>
                      </div>
                      <!--[if mso]></td></tr></table><![endif]-->
                  </td>
              </tr>
          </tbody>
      </table>
      <!-- hero-icon-lines -->
      <table width="100%" cellspacing="0" cellpadding="0" border="0" role="presentation">
          <tbody>
              <tr>
                  <td class="o_bg-ultra_light o_px-md o_py-xl o_xs-py-md" align="center">
                      <!--[if mso]><table width="584" cellspacing="0" cellpadding="0" border="0" role="presentation"><tbody><tr><td align="center"><![endif]-->
                      <div class="o_col-6s o_sans o_text-md o_text-light o_center">
                          <table class="o_center" role="presentation" cellspacing="0" cellpadding="0" border="0">
                              <tbody>
                                  <tr>
                                      <td class="o_bb-primary" height="40" width="32">&nbsp; </td>
                                      <td rowspan="2" class="o_sans o_text o_text-secondary o_px o_py" align="center">
                                          <img src="https://cdn-icons-png.flaticon.com/128/9178/9178566.png" width="48" height="48" alt="" style="max-width: 48px;">
                                      </td>
                                      <td class="o_bb-primary" height="40" width="32">&nbsp; </td>
                                  </tr>
                                  <tr>
                                      <td height="40">&nbsp; </td>
                                      <td height="40">&nbsp; </td>
                                  </tr>
                                  <tr>
                                      <td style="font-size: 8px; line-height: 8px; height: 8px;">&nbsp; </td>
                                      <td style="font-size: 8px; line-height: 8px; height: 8px;">&nbsp; </td>
                                  </tr>
                              </tbody>
                          </table>
                          <h2 class="o_heading o_text-dark o_mb-xxs">Your Invitation Awaits!</h2>
                          <p>We're excited to invite you to join us at <strong><em>${companyName}</em></strong> on the Fintech App platform.Access exclusive opportunities and insights through our portal.</p>
                      </div>
                      <!--[if mso]></td></tr></table><![endif]-->
                  </td>
              </tr>
          </tbody>
      </table>
      <!-- spacer -->
      <table width="100%" cellspacing="0" cellpadding="0" border="0" role="presentation">
          <tbody>
              <tr>
                  <td class="o_bg-white" style="font-size: 24px; line-height: 24px; height: 24px;">&nbsp; </td>
              </tr>
          </tbody>
      </table>
      <!-- content -->
      <table width="100%" cellspacing="0" cellpadding="0" border="0" role="presentation">
          <tbody>
              <tr>
                  <td class="o_bg-white o_px-md o_py" align="center">
                      <!--[if mso]><table width="584" cellspacing="0" cellpadding="0" border="0" role="presentation"><tbody><tr><td align="center"><![endif]-->
                      <div class="o_col-6s o_sans o_text o_text-secondary o_center">
                      
                          <p>To begin your journey with us,click the button below:</p>
                      </div>
                      <!--[if mso]></td></tr></table><![endif]-->
                  </td>
              </tr>
          </tbody>
      </table>
      <!-- button-primary -->
      <table width="100%" cellspacing="0" cellpadding="0" border="0" role="presentation">
          <tbody>
              <tr>
                  <td class="o_bg-white o_px-md o_py-xs" align="center">
                      <table align="center" cellspacing="0" cellpadding="0" border="0" role="presentation">
                          <tbody>
                              <tr>
                                  <td width="300" class="o_btn o_bg-primary o_br o_heading o_text" align="center">
                                      <a class="o_text-white" href="${url}" style="color:white;">Click here</a>
                                  </td>
                              </tr>
                          </tbody>
                      </table>
                  </td>
              </tr>
          </tbody>
      </table>
      <!-- spacer-lg -->
      <table width="100%" cellspacing="0" cellpadding="0" border="0" role="presentation">
          <tbody>
              <tr>
                  <td class="o_bg-white" style="font-size: 48px; line-height: 48px; height: 48px;">&nbsp; </td>
              </tr>
          </tbody>
      </table>
      <!-- footer-white-2cols -->
      <table width="100%" cellspacing="0" cellpadding="0" border="0" role="presentation">
          <tbody>
              <tr>
                  <td class="o_re o_bg-white o_px o_pb-lg o_bt-light" align="center">
                      <!--[if mso]><table cellspacing="0" cellpadding="0" border="0" role="presentation"><tbody><tr><td width="200" align="left" valign="top" style="padding:0px 8px;"><![endif]-->
                      <div class="o_col o_col-4">
                          <div style="font-size: 32px; line-height: 32px; height: 32px;">&nbsp; </div>
                          <div class="o_px-xs o_sans o_text-xs o_text-light o_left o_xs-center">
                              <p class="o_mb-xs">©2023 Fintech App. All rights reserved.</p>
                              <p>
                                  <a class="o_text-light o_underline" href="https://fintechapp.satva.solutions">Contact Us</a> <span class="o_hide-xs">&nbsp; • &nbsp;</span><br class="o_hide-lg">
                              </p>
                          </div>
                      </div>
                      <!--[if mso]></td><td width="400" align="right" valign="top" style="padding:0px 8px;"><![endif]-->
                      <div class="o_col o_col-2">
                          <div style="font-size: 32px; line-height: 32px; height: 32px;">&nbsp; </div>
                          <div class="o_px-xs o_sans o_text-xs o_text-light o_right o_xs-center">
                              <p>
                                  <a class="o_text-light" href="https://www.facebook.com/login/"><img src="https://cdn-icons-png.flaticon.com/128/3955/3955011.png" width="36" height="36" alt="fb" style="max-width: 36px;"></a><span> &nbsp;</span>
                                  <a class="o_text-light" href="https://www.instagram.com/accounts/login/"><img src="https://cdn-icons-png.flaticon.com/128/3955/3955024.png" width="36" height="36" alt="ig" style="max-width: 36px;"></a><span> &nbsp;</span>
                              </p>
                          </div>
                      </div>
                      <!--[if mso]></td></tr></table><![endif]-->
                      <div class="o_hide-xs" style="font-size: 64px; line-height: 64px; height: 64px;">&nbsp; </div>
                  </td>
              </tr>
          </tbody>
      </table>
  </body>
  </html>
    `;
  };
  
  // Send email to admin on user invitation
  export const getInvitationAdminMailTemplate = (data: any) => {
    const { invitedByEmail, email, companyName, url } = data;
    return `
      <!DOCTYPE html>
              <html lang="en">
                  <head>
                          <meta charset="UTF-8" />
                          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
              
              <link rel="preconnect" href="https://fonts.googleapis.com">
              <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
              <link href="https://fonts.googleapis.com/css2?family=Lexend:wght@400;500;600&display=swap" rel="stylesheet">
                          <title>Browser</title> 
                  </head>
                  <body>
                   
                    <div style="width:100%; min-height:60vh;display:block; background-color:#f8f1e9; padding : 200px 0px; font-family:'Lexend', sans-serif;">
                          <div class="my-card" style="background-color:#fff; border:2px solid #e0e0eb; padding:30px; max-width:470px; border-radius:15px; margin:auto">
                              <div class="card-header">
                                  <img src="https://costallocationspro.s3.amazonaws.com/image/cap-logo.png" width="200"/>
                              </div>
                              <div class="card-body">
                                      <p style="font-weight:600; font-size:20px">Invitation to join the company.</p>
                                      <p>Hi <b>${invitedByEmail}</b>,</p>
                                      <p>		You just invited ${email} to ${companyName} on CostAllocation Pro.</p><p> If you don't want this person on your account, you can delete them from your Manage Users page.</p>  
                                          <br/>
                                      <p style="margin:30px 0px"><button class="reset-button" style="border:none;border-radius:20px;padding:8px 20px;background-color:#000;"><a href='${url}' style="color:white;text-decoration:none;">Click Here<a/></button>, to view the Manage Users page.</p>
                              </div>
                          </div> 
                      </div>
                  </body>
              </html>
    `;
  };
  
  // Send email to user on invitation for the first time
  export const getInvitationEmailUserTemplate = (data: any) => {
    const { email, companyName, url } = data;
  
    return `
    <!doctype html>
    <html lang="en">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
        <meta name="x-apple-disable-message-reformatting">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <title>Account Password Reset</title>
    
        <style>
            .o_sans,
            .o_heading {
                font-family: Helvetica, Arial, sans-serif;
            }
    
            .o_heading {
                font-weight: bold;
            }
    
            .o_sans,
            .o_heading,
            .o_sans p,
            .o_sans li {
                margin-top: 0px;
                margin-bottom: 0px;
            }
    
            a {
                text-decoration: none;
                outline: none;
            }
    
            .o_underline {
                text-decoration: underline;
            }
    
            .o_linethrough {
                text-decoration: line-through;
            }
    
            .o_nowrap {
                white-space: nowrap;
            }
    
            .o_caps {
                text-transform: uppercase;
                letter-spacing: 1px;
            }
    
            .o_nowrap {
                white-space: nowrap;
            }
    
            .o_text-xxs {
                font-size: 12px;
                line-height: 19px;
            }
    
            .o_text-xs {
                font-size: 14px;
                line-height: 21px;
            }
    
            .o_text {
                font-size: 16px;
                line-height: 24px;
            }
    
            .o_text-md {
                font-size: 19px;
                line-height: 28px;
            }
    
            .o_text-lg {
                font-size: 24px;
                line-height: 30px;
            }
    
            h1.o_heading {
                font-size: 36px;
                line-height: 47px;
            }
    
            h2.o_heading {
                font-size: 30px;
                line-height: 39px;
            }
    
            h3.o_heading {
                font-size: 24px;
                line-height: 31px;
            }
    
            h4.o_heading {
                font-size: 18px;
                line-height: 23px;
            }
    
            body,
            .e_body {
                width: 100%;
                margin: 0px;
                padding: 0px;
                -webkit-text-size-adjust: 100%;
                -ms-text-size-adjust: 100%;
            }
    
            .o_re {
                font-size: 0;
                vertical-align: top;
            }
    
            .o_block {
                max-width: 632px;
                margin: 0 auto;
            }
    
            .o_block-lg {
                max-width: 800px;
                margin: 0 auto;
            }
    
            .o_block-xs {
                max-width: 432px;
                margin: 0 auto;
            }
    
            .o_col,
            .o_col_i {
                display: inline-block;
                vertical-align: top;
            }
    
            .o_col {
                width: 100%;
            }
    
            .o_col-1 {
                max-width: 100px;
            }
    
            .o_col-o {
                max-width: 132px;
            }
    
            .o_col-2 {
                max-width: 200px;
            }
    
            .o_col-3 {
                max-width: 300px;
            }
    
            .o_col-4 {
                max-width: 400px;
            }
    
            .o_col-oo {
                max-width: 468px;
            }
    
            .o_col-5 {
                max-width: 500px;
            }
    
            .o_col-6s {
                max-width: 584px;
            }
    
            .o_col-6 {
                max-width: 600px;
            }
    
            img {
                -ms-interpolation-mode: bicubic;
                vertical-align: middle;
                border: 0;
                line-height: 100%;
                height: auto;
                outline: none;
                text-decoration: none;
            }
    
            .o_img-full {
                width: 100%;
            }
    
            .o_inline {
                display: inline-block;
            }
    
            .o_btn {
                mso-padding-alt: 12px 24px;
            }
    
                .o_btn a {
                    display: block;
                    padding: 12px 24px;
                    mso-text-raise: 3px;
                }
    
            .o_btn-o {
                mso-padding-alt: 8px 20px;
            }
    
                .o_btn-o a {
                    display: block;
                    padding: 8px 20px;
                    mso-text-raise: 3px;
                }
    
            .o_btn-xs {
                mso-padding-alt: 7px 16px;
            }
    
                .o_btn-xs a {
                    display: block;
                    padding: 7px 16px;
                    mso-text-raise: 3px;
                }
    
            .o_btn-b {
                mso-padding-alt: 7px 8px;
            }
    
                .o_btn-b a {
                    display: block;
                    padding: 7px 8px;
                    font-weight: bold;
                }
    
                .o_btn-b span {
                    mso-text-raise: 6px;
                    display: inline;
                }
    
            .img_fix {
                mso-text-raise: 6px;
                display: inline;
            }
    
            .o_bg-light {
                background-color: #dbe5ea;
            }
    
            .o_bg-ultra_light {
                background-color: #ebf5fa;
            }
    
            .o_bg-white {
                background-color: #ffffff;
            }
    
            .o_bg-dark {
                background-color: #242b3d;
            }
    
            .o_bg-primary {
                background-color: #126de5;
            }
    
            .o_bg-secondary {
                background-color: #424651;
            }
    
            .o_bg-success {
                background-color: #0ec06e;
            }
    
            .o_text-primary,
            a.o_text-primary span,
            a.o_text-primary strong,
            .o_text-primary.o_link a {
                color: #126de5;
            }
    
            .o_text-secondary,
            a.o_text-secondary span,
            a.o_text-secondary strong,
            .o_text-secondary.o_link a {
                color: #424651;
            }
    
            .o_text-dark,
            a.o_text-dark span,
            a.o_text-dark strong,
            .o_text-dark.o_link a {
                color: #242b3d;
            }
    
            .o_text-dark_light,
            a.o_text-dark_light span,
            a.o_text-dark_light strong,
            .o_text-dark_light.o_link a {
                color: #a0a3ab;
            }
    
            .o_text-white,
            a.o_text-white span,
            a.o_text-white strong,
            .o_text-white.o_link a {
                color: #ffffff;
            }
    
            .o_text-light,
            a.o_text-light span,
            a.o_text-light strong,
            .o_text-light.o_link a {
                color: #82899a;
            }
    
            .o_text-success,
            a.o_text-success span,
            a.o_text-success strong,
            .o_text-success.o_link a {
                color: #0ec06e;
            }
    
            .o_b-primary {
                border: 2px solid #126de5;
            }
    
            .o_bb-primary {
                border-bottom: 1px solid #126de5;
            }
    
            .o_b-secondary {
                border: 2px solid #424651;
            }
    
            .o_bx-secondary {
                border: 1px solid #424651;
            }
    
            .o_bb-secondary {
                border-bottom: 1px solid #424651;
            }
    
            .o_b-dark {
                border: 2px solid #242b3d;
            }
    
            .o_b-light {
                border: 1px solid #d3dce0;
            }
    
            .o_bb-light {
                border-bottom: 1px solid #d3dce0;
            }
    
            .o_bt-light {
                border-top: 1px solid #d3dce0;
            }
    
            .o_br-light {
                border-right: 4px solid #d3dce0;
            }
    
            .o_bb-ultra_light {
                border-bottom: 1px solid #b6c0c7;
            }
    
            .o_bb-dark_light {
                border-bottom: 1px solid #4a5267;
            }
    
            .o_bt-dark_light {
                border-top: 1px solid #4a5267;
            }
    
            .o_b-white {
                border: 2px solid #ffffff;
            }
    
            .o_bb-white {
                border-bottom: 1px solid #ffffff;
            }
    
            .o_br {
                border-radius: 4px;
            }
    
            .o_br-t {
                border-radius: 4px 4px 0px 0px;
            }
    
            .o_br-b {
                border-radius: 0px 0px 4px 4px;
            }
    
            .o_br-l {
                border-radius: 4px 0px 0px 4px;
            }
    
            .o_br-r {
                border-radius: 0px 4px 4px 0px;
            }
    
            .o_br-max {
                border-radius: 96px;
            }
    
            .o_hide,
            .o_hide-lg {
                display: none;
                font-size: 0;
                max-height: 0;
                width: 0;
                line-height: 0;
                overflow: hidden;
                mso-hide: all;
                visibility: hidden;
            }
    
            .o_center {
                text-align: center;
            }
    
            table.o_center {
                margin-left: auto;
                margin-right: auto;
            }
    
            .o_left {
                text-align: left;
            }
    
            table.o_left {
                margin-left: 0;
                margin-right: auto;
            }
    
            .o_right {
                text-align: right;
            }
    
            table.o_right {
                margin-left: auto;
                margin-right: 0;
            }
    
            .o_px {
                padding-left: 16px;
                padding-right: 16px;
            }
    
            .o_px-xs {
                padding-left: 8px;
                padding-right: 8px;
            }
    
            .o_px-md {
                padding-left: 24px;
                padding-right: 24px;
            }
    
            .o_px-lg {
                padding-left: 32px;
                padding-right: 32px;
            }
    
            .o_py {
                padding-top: 16px;
                padding-bottom: 16px;
            }
    
            .o_py-xs {
                padding-top: 8px;
                padding-bottom: 8px;
            }
    
            .o_py-md {
                padding-top: 24px;
                padding-bottom: 24px;
            }
    
            .o_py-lg {
                padding-top: 32px;
                padding-bottom: 32px;
            }
    
            .o_py-xl {
                padding-top: 64px;
                padding-bottom: 64px;
            }
    
            .o_pt-xs {
                padding-top: 8px;
            }
    
            .o_pt {
                padding-top: 16px;
            }
    
            .o_pt-md {
                padding-top: 24px;
            }
    
            .o_pt-lg {
                padding-top: 32px;
            }
    
            .o_pb-xs {
                padding-bottom: 8px;
            }
    
            .o_pb {
                padding-bottom: 16px;
            }
    
            .o_pb-md {
                padding-bottom: 24px;
            }
    
            .o_pb-lg {
                padding-bottom: 32px;
            }
    
            .o_p-icon {
                padding: 12px;
            }
    
            .o_body .o_mb-xxs {
                margin-bottom: 4px;
            }
    
            .o_body .o_mb-xs {
                margin-bottom: 8px;
            }
    
            .o_body .o_mb {
                margin-bottom: 16px;
            }
    
            .o_body .o_mb-md {
                margin-bottom: 24px;
            }
    
            .o_body .o_mb-lg {
                margin-bottom: 32px;
            }
    
            .o_body .o_mt {
                margin-top: 16px;
            }
    
            .o_body .o_mt-md {
                margin-top: 24px;
            }
    
            .o_bg-center {
                background-position: 50% 0;
                background-repeat: no-repeat;
            }
    
            .o_bg-left {
                background-position: 0 0;
                background-repeat: no-repeat;
            }
    
            @media (max-width: 649px) {
                .o_col-full {
                    max-width: 100% !important;
                }
    
                .o_col-half {
                    max-width: 50% !important;
                }
    
                .o_hide-lg {
                    display: inline-block !important;
                    font-size: inherit !important;
                    max-height: none !important;
                    line-height: inherit !important;
                    overflow: visible !important;
                    width: auto !important;
                    visibility: visible !important;
                }
    
                .o_hide-xs,
                .o_hide-xs.o_col_i {
                    display: none !important;
                    font-size: 0 !important;
                    max-height: 0 !important;
                    width: 0 !important;
                    line-height: 0 !important;
                    overflow: hidden !important;
                    visibility: hidden !important;
                    height: 0 !important;
                }
    
                .o_xs-center {
                    text-align: center !important;
                }
    
                .o_xs-left {
                    text-align: left !important;
                }
    
                .o_xs-right {
                    text-align: left !important;
                }
    
                table.o_xs-left {
                    margin-left: 0 !important;
                    margin-right: auto !important;
                    float: none !important;
                }
    
                table.o_xs-right {
                    margin-left: auto !important;
                    margin-right: 0 !important;
                    float: none !important;
                }
    
                table.o_xs-center {
                    margin-left: auto !important;
                    margin-right: auto !important;
                    float: none !important;
                }
    
                h1.o_heading {
                    font-size: 32px !important;
                    line-height: 41px !important;
                }
    
                h2.o_heading {
                    font-size: 26px !important;
                    line-height: 37px !important;
                }
    
                h3.o_heading {
                    font-size: 20px !important;
                    line-height: 30px !important;
                }
    
                .o_xs-py-md {
                    padding-top: 24px !important;
                    padding-bottom: 24px !important;
                }
    
                .o_xs-pt-xs {
                    padding-top: 8px !important;
                }
    
                .o_xs-pb-xs {
                    padding-bottom: 8px !important;
                }
            }
    
            @media screen {
                @font-face {
                    font-family: 'Roboto';
                    font-style: normal;
                    font-weight: 400;
                    src: local("Roboto"), local("Roboto-Regular"), url(https://fonts.gstatic.com/s/roboto/v18/KFOmCnqEu92Fr1Mu7GxKOzY.woff2) format("woff2");
                    unicode-range: U+0100-024F, U+0259, U+1E00-1EFF, U+2020, U+20A0-20AB, U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF;
                }
    
                @font-face {
                    font-family: 'Roboto';
                    font-style: normal;
                    font-weight: 400;
                    src: local("Roboto"), local("Roboto-Regular"), url(https://fonts.gstatic.com/s/roboto/v18/KFOmCnqEu92Fr1Mu4mxK.woff2) format("woff2");
                    unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
                }
    
                @font-face {
                    font-family: 'Roboto';
                    font-style: normal;
                    font-weight: 700;
                    src: local("Roboto Bold"), local("Roboto-Bold"), url(https://fonts.gstatic.com/s/roboto/v18/KFOlCnqEu92Fr1MmWUlfChc4EsA.woff2) format("woff2");
                    unicode-range: U+0100-024F, U+0259, U+1E00-1EFF, U+2020, U+20A0-20AB, U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF;
                }
    
                @font-face {
                    font-family: 'Roboto';
                    font-style: normal;
                    font-weight: 700;
                    src: local("Roboto Bold"), local("Roboto-Bold"), url(https://fonts.gstatic.com/s/roboto/v18/KFOlCnqEu92Fr1MmWUlfBBc4.woff2) format("woff2");
                    unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
                }
    
                .o_sans,
                .o_heading {
                    font-family: "Roboto", sans-serif !important;
                }
    
                .o_heading,
                strong,
                b {
                    font-weight: 700 !important;
                }
    
                a[x-apple-data-detectors] {
                    color: inherit !important;
                    text-decoration: none !important;
                }
            }
        </style>
    </head>
    <body class="o_body o_bg-white">
        <!-- preview-text -->
        <table width="100%" cellspacing="0" cellpadding="0" border="0" role="presentation">
            <tbody>
                <tr>
                    <td class="o_hide" align="center">Unlock your digital realm with a personalized key. Open this email to forge your passkey and access a world of possibilities. The journey starts now.</td>
                </tr>
            </tbody>
        </table>
        <!-- header-white-link -->
        <table width="100%" cellspacing="0" cellpadding="0" border="0" role="presentation">
            <tbody>
                <tr>
                    <td class="o_re o_bg-white o_px o_pb-md">
                        <!--[if mso]><table cellspacing="0" cellpadding="0" border="0" role="presentation"><tbody><tr><td width="200" align="left" valign="top" style="padding:0px 8px;"><![endif]-->
                        <div class="o_col o_col-2">
                            <div style="font-size: 24px; line-height: 24px; height: 24px;">&nbsp; </div>
                            <div class="o_px-xs o_sans o_text o_left o_xs-center">
                                <p><a class="o_text-primary" href="https://fintechapp.satva.solutions"><img src="https://adma.tmsimg.com/assets/s57394_ll_h9_ad.png?w=360&h=270?w=100" width="150" height="40" alt="FintechApp" style="max-width: 400px;"></a></p>
                            </div>
                        </div>
                        <!--[if mso]></td><td width="400" align="right" valign="top" style="padding:0px 8px;"><![endif]-->
                        <div class="o_col o_col-4">
                            <div style="font-size: 22px; line-height: 22px; height: 22px;">&nbsp; </div>
                        </div>
                        <!--[if mso]></td></tr></table><![endif]-->
                    </td>
                </tr>
            </tbody>
        </table>
        <!-- hero-icon-lines -->
        <table width="100%" cellspacing="0" cellpadding="0" border="0" role="presentation">
            <tbody>
                <tr>
                    <td class="o_bg-ultra_light o_px-md o_py-xl o_xs-py-md" align="center">
                        <!--[if mso]><table width="584" cellspacing="0" cellpadding="0" border="0" role="presentation"><tbody><tr><td align="center"><![endif]-->
                        <div class="o_col-6s o_sans o_text-md o_text-light o_center">
                            <table class="o_center" role="presentation" cellspacing="0" cellpadding="0" border="0">
                                <tbody>
                                    <tr>
                                        <td class="o_bb-primary" height="40" width="32">&nbsp; </td>
                                        <td rowspan="2" class="o_sans o_text o_text-secondary o_px o_py" align="center">
                                            <img src="https://cdn-icons-png.flaticon.com/128/9178/9178566.png" width="48" height="48" alt="" style="max-width: 48px;">
                                        </td>
                                        <td class="o_bb-primary" height="40" width="32">&nbsp; </td>
                                    </tr>
                                    <tr>
                                        <td height="40">&nbsp; </td>
                                        <td height="40">&nbsp; </td>
                                    </tr>
                                    <tr>
                                        <td style="font-size: 8px; line-height: 8px; height: 8px;">&nbsp; </td>
                                        <td style="font-size: 8px; line-height: 8px; height: 8px;">&nbsp; </td>
                                    </tr>
                                </tbody>
                            </table>
                            <h2 class="o_heading o_text-dark o_mb-xxs">Your Invitation Awaits!</h2>
                            <p>We're excited to invite you to join us at <strong><em>${companyName}</em></strong> on the Fintech App platform.Access exclusive opportunities and insights through our portal.</p>
                        </div>
                        <!--[if mso]></td></tr></table><![endif]-->
                    </td>
                </tr>
            </tbody>
        </table>
        <!-- spacer -->
        <table width="100%" cellspacing="0" cellpadding="0" border="0" role="presentation">
            <tbody>
                <tr>
                    <td class="o_bg-white" style="font-size: 24px; line-height: 24px; height: 24px;">&nbsp; </td>
                </tr>
            </tbody>
        </table>
        <!-- content -->
        <table width="100%" cellspacing="0" cellpadding="0" border="0" role="presentation">
            <tbody>
                <tr>
                    <td class="o_bg-white o_px-md o_py" align="center">
                        <!--[if mso]><table width="584" cellspacing="0" cellpadding="0" border="0" role="presentation"><tbody><tr><td align="center"><![endif]-->
                        <div class="o_col-6s o_sans o_text o_text-secondary o_center">
                        
                            <p>To begin your journey with us, we kindly request you to generate a secure password for your account by clicking the button below:</p>
                        </div>
                        <!--[if mso]></td></tr></table><![endif]-->
                    </td>
                </tr>
            </tbody>
        </table>
        <!-- button-primary -->
        <table width="100%" cellspacing="0" cellpadding="0" border="0" role="presentation">
            <tbody>
                <tr>
                    <td class="o_bg-white o_px-md o_py-xs" align="center">
                        <table align="center" cellspacing="0" cellpadding="0" border="0" role="presentation">
                            <tbody>
                                <tr>
                                    <td width="300" class="o_btn o_bg-primary o_br o_heading o_text" align="center">
                                        <a class="o_text-white" href="${url}" style="color:white;">Set My Password</a>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </td>
                </tr>
            </tbody>
        </table>
        <!-- spacer-lg -->
        <table width="100%" cellspacing="0" cellpadding="0" border="0" role="presentation">
            <tbody>
                <tr>
                    <td class="o_bg-white" style="font-size: 48px; line-height: 48px; height: 48px;">&nbsp; </td>
                </tr>
            </tbody>
        </table>
        <!-- footer-white-2cols -->
        <table width="100%" cellspacing="0" cellpadding="0" border="0" role="presentation">
            <tbody>
                <tr>
                    <td class="o_re o_bg-white o_px o_pb-lg o_bt-light" align="center">
                        <!--[if mso]><table cellspacing="0" cellpadding="0" border="0" role="presentation"><tbody><tr><td width="200" align="left" valign="top" style="padding:0px 8px;"><![endif]-->
                        <div class="o_col o_col-4">
                            <div style="font-size: 32px; line-height: 32px; height: 32px;">&nbsp; </div>
                            <div class="o_px-xs o_sans o_text-xs o_text-light o_left o_xs-center">
                                <p class="o_mb-xs">©2023 Fintech App. All rights reserved.</p>
                                <p>
                                    <a class="o_text-light o_underline" href="https://fintechapp.satva.solutions">Contact Us</a> <span class="o_hide-xs">&nbsp; • &nbsp;</span><br class="o_hide-lg">
                                </p>
                            </div>
                        </div>
                        <!--[if mso]></td><td width="400" align="right" valign="top" style="padding:0px 8px;"><![endif]-->
                        <div class="o_col o_col-2">
                            <div style="font-size: 32px; line-height: 32px; height: 32px;">&nbsp; </div>
                            <div class="o_px-xs o_sans o_text-xs o_text-light o_right o_xs-center">
                                <p>
                                    <a class="o_text-light" href="https://www.facebook.com/login/"><img src="https://cdn-icons-png.flaticon.com/128/3955/3955011.png" width="36" height="36" alt="fb" style="max-width: 36px;"></a><span> &nbsp;</span>
                                    <a class="o_text-light" href="https://www.instagram.com/accounts/login/"><img src="https://cdn-icons-png.flaticon.com/128/3955/3955024.png" width="36" height="36" alt="ig" style="max-width: 36px;"></a><span> &nbsp;</span>
                                </p>
                            </div>
                        </div>
                        <!--[if mso]></td></tr></table><![endif]-->
                        <div class="o_hide-xs" style="font-size: 64px; line-height: 64px; height: 64px;">&nbsp; </div>
                    </td>
                </tr>
            </tbody>
        </table>
    </body>
    </html>
    `;
  };
  
  // Send email to admin when user is deleted
  export const getAdminEmailOnUserDeleteTemplate = (data: any) => {
    const { adminUserName, userName, companyName, url } = data;
  
    return `	
           <!DOCTYPE html>
              <html lang="en">
                  <head>
                          <meta charset="UTF-8" />
                          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
              
              <link rel="preconnect" href="https://fonts.googleapis.com">
              <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
              <link href="https://fonts.googleapis.com/css2?family=Lexend:wght@400;500;600&display=swap" rel="stylesheet">
                          <title>Browser</title> 
                  </head>
                  <body>
                   
                    <div style="width:100%; min-height:60vh;display:block; background-color:#f8f1e9; padding : 200px 0px; font-family:'Lexend', sans-serif;">
                          <div class="my-card" style="background-color:#fff; border:2px solid #e0e0eb; padding:30px; max-width:470px; border-radius:15px; margin:auto">
                              <div class="card-header">
                                  <img src="https://costallocationspro.s3.amazonaws.com/image/cap-logo.png" width="200"/>
                              </div>
                              <div class="card-body">
                                      <p style="font-weight:600; font-size:20px">Your Access has been Revoked - CostAllocation Pro</p>
                                      <p>Hi <b>${adminUserName}</b>,</p>
                                      <p>	User access for ${userName} has been removed from ${companyName} on CostAllocation Pro.</p>  
                                      <p>To view the Manage Users page </p>  
                                          <br/>
                                      <p style="margin:30px 0px"><button class="reset-button" style="border:none;border-radius:20px;padding:8px 20px;background-color:#000;"><a href='${url}' style="color:white;text-decoration:none;">Click Here<a/></button></p>
                              </div>
                          </div> 
                      </div>
                  </body>
              </html>
      `;
  };
  
  // Send email to the user who is deleted
  export const getUserEmailOnDeleteTemplate = (data: any) => {
    const { userName, companyName } = data;
  
    return `
          <!DOCTYPE html>
              <html lang="en">
                  <head>
                          <meta charset="UTF-8" />
                          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
              
              <link rel="preconnect" href="https://fonts.googleapis.com">
              <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
              <link href="https://fonts.googleapis.com/css2?family=Lexend:wght@400;500;600&display=swap" rel="stylesheet">
                          <title>Browser</title> 
                  </head>
                  <body>
                   
                    <div style="width:100%; min-height:60vh;display:block; background-color:#f8f1e9; padding : 200px 0px; font-family:'Lexend', sans-serif;">
                          <div class="my-card" style="background-color:#fff; border:2px solid #e0e0eb; padding:30px; max-width:470px; border-radius:15px; margin:auto">
                              <div class="card-header">
                                  <img src="https://costallocationspro.s3.amazonaws.com/image/cap-logo.png" width="200"/>
                              </div>
                              <div class="card-body">
                                      <p style="font-weight:600; font-size:20px">Your Access has been Revoked - CostAllocation Pro</p>
                                      <p>Hi <b>${userName}</b>,</p>
                                      <p>	Your user access for ${companyName} on CostAllocation Pro has been removed. </p>  
                                      <p>Please contact the Administrator on your account if you have any questions.  </p>  
                                       </div>
                          </div> 
                      </div>
                  </body>
              </html>
      `;
  };
  