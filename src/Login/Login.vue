<template>
    <div class="Login">
        <div class="LoginBox">
            <div class="LoginName">登录</div>
            <form>
                <van-field
                    v-model="userPhone"
                    clearable
                    onkeyup="value=value.replace(/[^\d]/g,'')"
                    placeholder="输入手机号码"
                    class="input borderR"
                />
                <van-field
                    v-model="codeWord"
                    autocomplete="off"
                    placeholder="请输入验证码"
                    class="input borderR2"
                >
                <span slot="button" size="small" style="color:#007EFF" id="btn" v-show="show" @click="getCode">发送验证码</span>
                <span slot="button" size="small" style="color:#007EFF" v-show="!show" class="count">{{count}} s</span>
                </van-field>
            </form>
            <div id="captcha"></div>
            <div class="checkbox">
                <van-checkbox v-model="checked" @change="xieyi" class="checked"></van-checkbox>
                <div class="checkboxT" @click="text(true)">我已同意《区块量化平台服务使用协议及隐私政策》</div>
            </div>
            <button type="primary" class="Loginbtn" @click="postLogin()">登录</button>
        </div>
        <van-popup v-model="showxieyi" position="bottom" :overlay="false" lazy-render>
            <div>
                <div style="padding: 15px">
                    <p style="margin:0pt"><span style="font-family:'Times New Roman'; font-size:12pt;display: block;text-align: center;padding-bottom: 10px;font-weight: 700;">《 区块量化平台服务使用协议及隐私政策 》</span></p>
                    <p style="margin:0pt"><span style="font-family:'Times New Roman'; font-size:12pt">“区块量化”平台（以下称“区块量化”）是一个专门供用户进行数字资产量化交易和提供相关服务的平台。为了协议表述之方便，我公司和区块量化在本协议中合称使用“我们”或其他第一人称称呼，本协议中的用户是指登录区块量化的自然人或法人，以下使用“您”或者其他第二人称；以下使用“您”或其他第二人称。我们和您在本协议中合称为“双方”，我们或您单称为“一方”。下述条款和条件是您与“区块量化”平台之间订立的合约（“用户协议”、“本协议”、“本条款及条件”）。请仔细阅读本协议。请确认您已理解并接受本协议。</span></p>
                    <p style="margin:0pt"><span style="font-family:'Times New Roman'; font-size:12pt">《用户协议》（“本协议”或“本条款及条件”），由重要提示、正文、了解你的客户和反洗钱政策以及区块量化已经发布的或将来可能发布的各类规则、声明、说明、免责条款、其他等构成。</span></p>
                    <p style="margin:0pt"><span style="font-family:'Times New Roman'; font-size:12pt">请你务必审慎阅读、充分理解各条款内容，特别是免除或者限制责任的条款，以及开通或使用某项服务的单独协议，并选择接受或不接受。限制、免责条款可能以加粗形式提示你注意。</span></p>
                    <p style="margin:0pt"><span style="font-family:'Times New Roman'; font-size:12pt">“区块量化”所有内容，为便利用户，可能提供多个语言版本，若有冲突或遗漏等情况，以中文内容为准。</span></p>
                    <p style="margin:0pt"><span style="font-family:'Times New Roman'; font-size:12pt">&nbsp;</span></p>
                    <p style="margin:0pt"><span style="font-family:'Times New Roman'; font-size:12pt">重要提示：</span></p>
                    <p style="margin:0pt"><span style="font-family:'Times New Roman'; font-size:12pt">我们在此特别提醒您：</span></p>
                    <p style="margin:0pt"><span style="width:36pt; text-indent:0pt; display:inline-block"></span><span style="font-family:'Times New Roman'; font-size:12pt">1.数字资产本身不由任何金融机构或公司发行；</span></p>
                    <p style="margin:0pt"><span style="width:36pt; text-indent:0pt; display:inline-block"></span><span style="font-family:'Times New Roman'; font-size:12pt">2.数字资产市场是全新的、未经确认的，而且可能不会增长；</span></p>
                    <p style="margin:0pt"><span style="width:36pt; text-indent:0pt; display:inline-block"></span><span style="font-family:'Times New Roman'; font-size:12pt">3.数字资产主要由投资者大量使用，零售和商业市场使用相对较少，数字资产交易存在极高风险，其全天不间断交易，没有涨跌限制，价格容易受其他投资者、全球政府政策的影响而大幅波动；</span></p>
                    <p style="margin:0pt"><span style="width:36pt; text-indent:0pt; display:inline-block"></span><span style="font-family:'Times New Roman'; font-size:12pt">4.因各国法律、法规和规范性文件的制定或者修改，数字资产交易随时可能被暂停或被禁止。</span></p>
                    <p style="margin:0pt"><span style="font-family:'Times New Roman'; font-size:12pt">&nbsp;</span></p>
                    <p style="margin:0pt"><span style="font-family:'Times New Roman'; font-size:12pt">数字资产交易有极高风险，并不适合绝大部分人士。您了解和理解此投资有可能导致部分损失或全部损失，所以您应该以能承受的损失程度来决定投资的金额。 我们在此默认您了解和理解数字资产会产生衍生风险，所以如有任何疑问，建议先寻求理财顾问的协助。除了上述提及过的风险以外，还会有未能预测的风险存在。您应慎重考虑并用清晰的判断能力去评估自己的财政状况及上述各项风险而作出任何买卖数字资产的决定，并承担由此产生的全部损失，我们对此不承担任何责任。</span></p>
                    <p style="margin:0pt"><span style="font-family:'Times New Roman'; font-size:12pt"> 敬告您：</span></p>
                    <p style="margin:0pt"><span style="width:36pt; text-indent:0pt; display:inline-block"></span><span style="font-family:'Times New Roman'; font-size:12pt">1.您了解区块量化仅作为您获取数字资产信息、寻找交易方、就数字资产的交易进行协商及开展交易的场所，区块量化不参与您的任何交易，故您应自行谨慎判断确定相关数字资产及/或信息的真实性、合法性和有效性，并自行承担因此产生的责任与损失。</span></p>
                    <p style="margin:0pt"><span style="width:36pt; text-indent:0pt; display:inline-block"></span><span style="font-family:'Times New Roman'; font-size:12pt">2.“区块量化”的任何意见、消息、探讨、分析、价格、建议和其他资讯均是一般的市场评论，并不构成投资建议。我们不承担任何因依赖该资讯直接或间接而产生的损失，包括但不限于任何利润损失。</span></p>
                    <p style="margin:0pt"><span style="width:36pt; text-indent:0pt; display:inline-block"></span><span style="font-family:'Times New Roman'; font-size:12pt">3.使用互联网形式的交易系统亦存有风险，包括但不限于软件，硬件和互联网连接的失败等。由于我们不能控制互联网的可靠性和可用性，我们不会对失真、延误和连接失败而承担任何责任。</span></p>
                    <p style="margin:0pt"><span style="width:36pt; text-indent:0pt; display:inline-block"></span><span style="font-family:'Times New Roman'; font-size:12pt">4.我们平台以及策略开发者发布的内容不作为您投资的依据，您接受我们服务后须独立作出投资决策，风险自担。请您确认自己具有相应的权利能力和行为能力，能够独立承担法律责任。无论付费或是免费服务，都不能确保您获得盈利或本金不受损失。数字货币市场有风险，入市须谨慎。</span></p>
                    <p style="margin:0pt"><span style="width:36pt; text-indent:0pt; display:inline-block"></span><span style="font-family:'Times New Roman'; font-size:12pt">5.我们平台上所有策略开发者发布的内容均由开发者和发布者自行负责，平台不对内容的准确性、真实性、有效性、原创性负责。我们平台将尽合理的注意义务审核策略开发者的各项资料，但平台不对上述审核承担任何保证义务，如因策略开发者个人原因提交虚假资料，平台核实后将予以处理，但您无权就此要求平台承担任何责任。</span></p>
                    <p style="margin:0pt"><span style="width:36pt; text-indent:0pt; display:inline-block"></span><span style="font-family:'Times New Roman'; font-size:12pt">6.策略开发者发布的内容（包括但不限于策略、组合、选币、预警、指标等）所涉及的任何投资品种以及任何操作仅代表个人观点，不代表我们平台观点，仅限于用户间交流和探讨，不构成投资建议，不具有证券投资咨询信息性质，不构成对任何股票、债券、数字货币或任何其它任何金融产品的购买邀请，不应成为您作出任何投资或其他决定的依据。您须充分了解其合规性，平台不作任何信用担保。</span></p>
                    <p style="margin:0pt"><span style="width:36pt; text-indent:0pt; display:inline-block"></span><span style="font-family:'Times New Roman'; font-size:12pt">7.我们平台服务现包括投资组合、量化策略、选币器、预警、自编指标公式等，您在使用上述具体服务时还需同时遵守该项服务具体的服务协议。</span></p>
                    <p style="margin:0pt"><span style="width:36pt; text-indent:0pt; display:inline-block"></span><span style="font-family:'Times New Roman'; font-size:12pt">8.任何在本网站出现的信息包括但不限于评论、预测、图表、指标、理论、指示均只作为参考，您须对任何自主决定的行为负责。</span></p>
                    <p style="margin:0pt"><span style="width:36pt; text-indent:0pt; display:inline-block"></span><span style="font-family:'Times New Roman'; font-size:12pt">9.我们提供或展示的有关策略，只保证其历史信号及历史产生的收益为真实有效的，未来收益情况不能按照历史简单统计，所有直接或间接使用策略用于真实交易的用户需要谨慎选择，合理运用。我们不承担任何因策略产生的资金损失及相关责任，凡使用策略的用户，我们依据相关法律法规，默认用户已同意此条款;</span></p>
                    <p style="margin:0pt"><span style="width:36pt; text-indent:0pt; display:inline-block"></span><span style="font-family:'Times New Roman'; font-size:12pt">10.我们对于因您自身原因所使用的各项服务不负任何赔偿责任。</span></p>
                    <p style="margin:0pt"><span style="width:36pt; text-indent:0pt; display:inline-block"></span><span style="font-family:'Times New Roman'; font-size:12pt">11.凡通过本网站与其他网站的链接，而获得其所提供的网上资料及内容，您应该自己进行辨别及判断，并应当由该等网站对其提供内容承担相应责任，本公司对此不承担任何责任。本网站提供超级链接至其它网站，并不视为同意、推荐、认可、保证或推介任何第三方或在其网站所提供的服务、产品，亦不可视为与该等第三方及网站有任何形式的合作。</span></p>
                    <p style="margin:0pt"><span style="width:36pt; text-indent:0pt; display:inline-block"></span><span style="font-family:'Times New Roman'; font-size:12pt">12.用户在他们发表的信息中加入宣传资料或参与广告策划，在我们平台的免费服务上展示他们的产品，任何这类促销方法，包括运输货物、付款、服务、商业条件、担保及与广告有关的描述都只是在相应的用户和广告销售商之间发生。我们没有义务为这类广告销售负任何一部分的责任。</span></p>
                    <p style="margin:0pt"><span style="width:36pt; text-indent:0pt; display:inline-block"></span><span style="font-family:'Times New Roman'; font-size:12pt">13.区块量化为公司官方对外信息公布的移动客户端平台;</span></p>
                    <p style="margin:0pt"><span style="width:36pt; text-indent:0pt; display:inline-block"></span><span style="font-family:'Times New Roman'; font-size:12pt">14.区块量化任何服务均不接受信用卡支付；</span></p>
                    <p style="margin:0pt"><span style="width:36pt; text-indent:0pt; display:inline-block"></span><span style="font-family:'Times New Roman'; font-size:12pt">15.禁止使用区块量化从事洗钱、走私、商业贿赂等一切非法交易活动，若发现此类事件，本站将采取各种可使用之手段，包括但不限于冻结账户，通知相关权力机关等，我们不承担由此产生的所有责任并保留向相关人士追究责任的权利。</span></p>
                    <p style="margin:0pt"><span style="width:36pt; text-indent:0pt; display:inline-block"></span><span style="font-family:'Times New Roman'; font-size:12pt">16.禁止使用区块量化进行恶意操纵市场、不正当交易等一切不道德交易活动，若发现此类事件，区块量化将对所有恶意操纵价格、恶意影响交易系统等不道德的行为采取警告、限制交易、关停账户等预防性地保护措施，我们不承担由此产生的所有责任并保留向相关人士追究责任的权利。</span></p>
                    <p style="margin:0pt"><span style="font-family:'Times New Roman'; font-size:12pt">正文</span></p>
                    <p style="margin:0pt"><span style="font-family:'Times New Roman'; font-size:12pt">一、总则</span></p>
                    <p style="margin:0pt"><span style="font-family:'Times New Roman'; font-size:12pt">&nbsp;</span></p>
                    <p style="margin:0pt"><span style="width:36pt; text-indent:0pt; display:inline-block"></span><span style="font-family:'Times New Roman'; font-size:12pt">1.您在使用区块量化提供的各项服务之前，应仔细阅读本协议，如有不理解之处或其他必要，请咨询专业律师。如您不同意本协议及/或随时对其的修改，请您立即停止使用区块量化提供的服务或不再登陆区块量化。您一旦登陆区块量化、使用区块量化的任何服务或任何其他类似行为即表示您已了解并完全同意本协议各项内容，包括区块量化对本协议随时所做的任何修改。</span></p>
                    <p style="margin:0pt"><span style="width:36pt; text-indent:0pt; display:inline-block"></span><span style="font-family:'Times New Roman'; font-size:12pt">2.您通过按照区块量化的要求填写相关信息，并经过其他相关程序后成功注册可以成为区块量化的用户（以下称“用户”），在进行注册过程中点击“同意”按钮即表示您以电子签署的形式与公司达成协议；或您在使用区块量化过程中点击任何标有“同意”或类似意思的按钮的行为或以其他区块量化允许的方式实际使用区块量化提供的服务时，均表示您完全了解、同意且接受本协议项下的全部条款的约束，无您手写的书面签字就本协议对您的法律约束力无任何影响。</span></p>
                    <p style="margin:0pt"><span style="width:36pt; text-indent:0pt; display:inline-block"></span><span style="font-family:'Times New Roman'; font-size:12pt">3.成为区块量化的用户后，您将获得一个用户帐号及相应的密码，该用户帐号和密码由用户负责保管；用户应当对以其帐号进行的所有活动负法律责任。</span></p>
                    <p style="margin:0pt"><span style="width:36pt; text-indent:0pt; display:inline-block"></span><span style="font-family:'Times New Roman'; font-size:12pt">4.只有成为区块量化的用户才可使用区块量化提供的数字资产交易平台进行交易及享受其他区块量化规定的只有用户才可获得的服务；用户外的其他人只有登陆、浏览区块量化及其他区块量化规定的可获得的服务。</span></p>
                    <p style="margin:0pt"><span style="width:36pt; text-indent:0pt; display:inline-block"></span><span style="font-family:'Times New Roman'; font-size:12pt">5.通过注册和使用任何由区块量化提供的服务和功能，您将被视为已阅读，理解并：</span></p>
                    <p style="margin:0pt"><span style="width:36pt; text-indent:0pt; display:inline-block"></span><span style="width:36pt; text-indent:0pt; display:inline-block"></span><span style="font-family:'Times New Roman'; font-size:12pt"> 5.1接受本协议所有条款及条件的约束。</span></p>
                    <p style="margin:0pt"><span style="width:36pt; text-indent:0pt; display:inline-block"></span><span style="width:36pt; text-indent:0pt; display:inline-block"></span><span style="font-family:'Times New Roman'; font-size:12pt"> 5.2您确认您已满18周岁或根据本协议订立地之法律具有完全的民事行为能力，您在区块量化的注册、销售或购买、发布信息等接受区块量化服务的行为应当符合对您有管辖权的主权国家或地区相关法律法规，并有充分的民事行为能力接受这些条款、订立交易、使用区块量化进行数字资产交易。</span></p>
                    <p style="margin:0pt"><span style="width:36pt; text-indent:0pt; display:inline-block"></span><span style="width:36pt; text-indent:0pt; display:inline-block"></span><span style="font-family:'Times New Roman'; font-size:12pt"> 5.3您保证交易中涉及到的属于您的数字资产均为合法取得并所有。</span></p>
                    <p style="margin:0pt"><span style="width:36pt; text-indent:0pt; display:inline-block"></span><span style="width:36pt; text-indent:0pt; display:inline-block"></span><span style="font-family:'Times New Roman'; font-size:12pt"> 5.4您同意您为您自身的交易或非交易行为承担全部责任和任何收益或亏损。</span></p>
                    <p style="margin:0pt"><span style="width:36pt; text-indent:0pt; display:inline-block"></span><span style="width:36pt; text-indent:0pt; display:inline-block"></span><span style="font-family:'Times New Roman'; font-size:12pt"> 5.5您确认注册时提供的信息是真实和准确的。</span></p>
                    <p style="margin:0pt"><span style="width:36pt; text-indent:0pt; display:inline-block"></span><span style="width:36pt; text-indent:0pt; display:inline-block"></span><span style="font-family:'Times New Roman'; font-size:12pt"> 5.6您同意遵守任何有关法律的规定，就税务目的而言，包括报告任何交易利润。</span></p>
                    <p style="margin:0pt"><span style="width:36pt; text-indent:0pt; display:inline-block"></span><span style="width:36pt; text-indent:0pt; display:inline-block"></span><span style="font-family:'Times New Roman'; font-size:12pt"> 5.7本协议只是就您与我们之间达成的权利义务关系进行约束，而并不涉及区块量化用户之间与其他应用和您之间因数字资产交易而产生的法律关系及法律纠纷。</span></p>
                    <p style="margin:0pt"><span style="font-family:'Times New Roman'; font-size:12pt">&nbsp;</span></p>
                    <p style="margin:0pt"><span style="font-family:'Times New Roman'; font-size:12pt">二、协议修订</span></p>
                    <p style="margin:0pt"><span style="font-family:'Times New Roman'; font-size:12pt">我们保留随时修订本协议、并以公示的方式进行公告、不再单独通知您的权利，变更后的协议会在本协议首页标注变更时间，一经在区块量化中公布，立即自动生效。您应不时浏览及关注本协议的更新变更时间及更新内容，如您不同意相关变更，应当立即停止使用区块量化服务；您继续使用区块量化服务，即表示您接受并同意经修订的协议的约束。</span></p>
                    <p style="margin:0pt"><span style="font-family:'Times New Roman'; font-size:12pt">&nbsp;</span></p>
                    <p style="margin:0pt"><span style="font-family:'Times New Roman'; font-size:12pt">三、注册</span></p>
                    <p style="margin:0pt"><span style="font-family:'Times New Roman'; font-size:12pt">1.注册资格</span></p>
                    <p style="margin:0pt"><span style="width:36pt; text-indent:0pt; display:inline-block"></span><span style="font-family:'Times New Roman'; font-size:12pt">您确认并承诺：在您完成注册程序或以其他区块量化允许的方式实际使用区块量化提供的服务时，您应当是具备可适用的法律规定的可签署本协议及使用区块量化服务应具有的能力的自然人、法人或其他组织。您一旦点击同意注册按钮，即表示您自身或您的代理人已经同意该协议内容并注册及使用区块量化服务。若您不具备前述主体资格，则您及您的代理人应承担因此而导致的一切后果，且公司保留注销或永久冻结您账户，并向您及您的代理人追究责任的权利。</span></p>
                    <p style="margin:0pt"><span style="font-family:'Times New Roman'; font-size:12pt">&nbsp;</span></p>
                    <p style="margin:0pt"><span style="font-family:'Times New Roman'; font-size:12pt">2.注册目的</span></p>
                    <p style="margin:0pt"><span style="width:36pt; text-indent:0pt; display:inline-block"></span><span style="font-family:'Times New Roman'; font-size:12pt">您确认并承诺：您进行区块量化注册并非出于违反法律法规或破坏区块量化数字资产交易秩序的目的。</span></p>
                    <p style="margin:0pt"><span style="font-family:'Times New Roman'; font-size:12pt">&nbsp;</span></p>
                    <p style="margin:0pt"><span style="font-family:'Times New Roman'; font-size:12pt">3.注册流程</span></p>
                    <p style="margin:0pt"><span style="width:36pt; text-indent:0pt; display:inline-block"></span><span style="font-family:'Times New Roman'; font-size:12pt"> 3.1您同意根据区块量化用户注册页面的要求提供有效电子邮箱、手机号码等信息，您可以使用您提供和确认的邮箱、手机号码或者区块量化允许的其它方式作为登陆手段进入区块量化。如有必要，按照不同法域相关法律法规的规定，您必须提供您的真实姓名、身份证件等法律法规及隐私条款及反洗钱条款规定的相关信息并不断更新注册资料，符合及时、详尽、准确的要求。所有原始键入的资料将引用为注册资料。您应对该等信息的真实性、完整性和准确性负责，并承担因此产生的任何直接或间接损失及不利后果。</span></p>
                    <p style="margin:0pt"><span style="width:36pt; text-indent:0pt; display:inline-block"></span><span style="font-family:'Times New Roman'; font-size:12pt"> 3.2如您所在主权国家或地区的法律法规、规则、命令等规范对手机号码有实名要求，您同意提供注册的手机号码是经过实名登记的，如您不按照规定提供，因此给您带来的任何直接或间接损失及不利后果均应由您承担。</span></p>
                    <p style="margin:0pt"><span style="width:36pt; text-indent:0pt; display:inline-block"></span><span style="font-family:'Times New Roman'; font-size:12pt"> 3.3您合法、完整并有效提供注册所需信息并经验证，有权获得区块量化账号和密码，您获得区块量化账号及密码时视为注册成功，可在区块量化进行用户登陆。</span></p>
                    <p style="margin:0pt"><span style="width:36pt; text-indent:0pt; display:inline-block"></span><span style="font-family:'Times New Roman'; font-size:12pt"> 3.4您同意接收区块量化发送的与区块量化管理、运营相关的电子邮件和/或短消息。</span></p>
                    <p style="margin:0pt"><span style="font-family:'Times New Roman'; font-size:12pt">&nbsp;</span></p>
                    <p style="margin:0pt"><span style="font-family:'Times New Roman'; font-size:12pt"> 四、服务</span></p>
                    <p style="margin:0pt"><span style="font-family:'Times New Roman'; font-size:12pt">“区块量化”只为您通过区块量化进行数字资产交易活动（包括但不限于数字资产交易等服务）提供网络交易平台服务，区块量化并不作为买家或卖家参与买卖数字资产行为本身；区块量化不提供任何国家法定货币充入和提取的相关服务。</span></p>
                    <p style="margin:0pt"><span style="font-family:'Times New Roman'; font-size:12pt">&nbsp;</span></p>
                    <p style="margin:0pt"><span style="font-family:'Times New Roman'; font-size:12pt">1.服务内容</span></p>
                    <p style="margin:0pt"><span style="width:36pt; text-indent:0pt; display:inline-block"></span><span style="font-family:'Times New Roman'; font-size:12pt"> 1.1您有权在区块量化浏览数字资产各项产品的实时行情及交易信息、有权通过区块量化提交数字资产交易指令并完成数字资产交易。</span></p>
                    <p style="margin:0pt"><span style="width:36pt; text-indent:0pt; display:inline-block"></span><span style="font-family:'Times New Roman'; font-size:12pt"> 1.2您有权在区块量化查看其区块量化用户账号下的信息，有权应用区块量化提供的功能进行操作。</span></p>
                    <p style="margin:0pt"><span style="width:36pt; text-indent:0pt; display:inline-block"></span><span style="font-family:'Times New Roman'; font-size:12pt"> 1.3您有权按照区块量化发布的活动规则参与区块量化组织的活动。</span></p>
                    <p style="margin:0pt"><span style="width:36pt; text-indent:0pt; display:inline-block"></span><span style="font-family:'Times New Roman'; font-size:12pt"> 1.4“区块量化”承诺为您提供的其他服务。</span></p>
                    <p style="margin:0pt"><span style="font-family:'Times New Roman'; font-size:12pt">2.服务规则</span></p>
                    <p style="margin:0pt"><span style="width:36pt; text-indent:0pt; display:inline-block"></span><span style="font-family:'Times New Roman'; font-size:12pt">您承诺遵守下列区块量化服务规则：</span></p>
                    <p style="margin:0pt"><span style="font-family:'Times New Roman'; font-size:12pt">&nbsp;</span></p>
                    <p style="margin:0pt"><span style="width:36pt; text-indent:0pt; display:inline-block"></span><span style="font-family:'Times New Roman'; font-size:12pt"> 2.1您应当遵守法律法规、规章及政策要求的规定，保证账户中所有数字资产来源的合法性，不得在区块量化或利用区块量化服务从事非法或其他损害区块量化或第三方权益的活动，如发送或接收任何违法、违规、侵犯他人权益的信息，发送或接收传销材料或存在其他危害的信息或言论，未经区块量化授权使用或伪造区块量化电子邮件题头信息等。</span></p>
                    <p style="margin:0pt"><span style="width:36pt; text-indent:0pt; display:inline-block"></span><span style="font-family:'Times New Roman'; font-size:12pt"> 2.2您应当遵守法律法规并妥善使用和保管其账号及登录密码、资金密码、注册时绑定的手机号码以及手机接收的手机验证码的安全。您对使用区块量化账号和登陆密码、资金密码、手机验证码进行的任何操作和后果承担全部责任。当您发现区块量化账号、登录密码、资金密码、验证码被未经授权的第三方使用，或存在其他账号安全问题时，应立即有效通知区块量化，要求区块量化暂停区块量化账号的服务。区块量化有权在合理时间内对您的该等请求采取行动，但区块量化对在采取行动前已经产生的后果（包括但不限于您的任何损失）不承担任何责任。您在未经区块量化同意的情况下不得将区块量化账号以赠与、借用、租用、转让或其他方式处分给他人。</span></p>
                    <p style="margin:0pt"><span style="width:36pt; text-indent:0pt; display:inline-block"></span><span style="font-family:'Times New Roman'; font-size:12pt"> 2.3您同意您对您的区块量化的账号、密码下发生的所有活动（包括但不限于信息披露、发布信息、网上点击同意或提交各类规则协议、网上续签协议或购买服务等）承担责任。</span></p>
                    <p style="margin:0pt"><span style="width:36pt; text-indent:0pt; display:inline-block"></span><span style="font-family:'Times New Roman'; font-size:12pt"> 2.4您在区块量化进行数字资产交易时不得恶意干扰数字资产交易的正常进行、破坏交易秩序；不得以任何技术手段或其他方式干扰区块量化的正常运行或干扰其他用户对区块量化服务的使用；不得以虚构事实等方式恶意诋毁区块量化的商誉。</span></p>
                    <p style="margin:0pt"><span style="width:36pt; text-indent:0pt; display:inline-block"></span><span style="font-family:'Times New Roman'; font-size:12pt"> 2.5您在使用区块量化提供的服务过程中，所产生的应纳税赋，以及一切硬件、软件、服务及其它方面的费用，均由您独自承担。</span></p>
                    <p style="margin:0pt"><span style="font-family:'Times New Roman'; font-size:12pt"> 2.6您应当遵守区块量化不时发布和更新的本协议以及其他服务条款和操作规则，有权随时终止使用区块量化提供的服务。</span></p>
                    <p style="margin:0pt"><span style="font-family:'Times New Roman'; font-size:12pt">3.产品规则</span></p>
                    <p style="margin:0pt"><span style="width:36pt; text-indent:0pt; display:inline-block"></span><span style="font-family:'Times New Roman'; font-size:12pt"> 3.1交易产品规则</span></p>
                    <p style="margin:0pt"><span style="width:36pt; text-indent:0pt; display:inline-block"></span><span style="width:36pt; text-indent:0pt; display:inline-block"></span><span style="font-family:'Times New Roman'; font-size:12pt">您承诺在其进入区块量化交易，通过区块量化与其他用户进行交易的过程中良好遵守如下交易规则。</span></p>
                    <p style="margin:0pt"><span style="font-family:'Times New Roman'; font-size:12pt">&nbsp;</span></p>
                    <p style="margin:0pt"><span style="width:36pt; text-indent:0pt; display:inline-block"></span><span style="font-family:'Times New Roman'; font-size:12pt"> 3.2浏览交易信息</span></p>
                    <p style="margin:0pt"><span style="width:36pt; text-indent:0pt; display:inline-block"></span><span style="width:36pt; text-indent:0pt; display:inline-block"></span><span style="font-family:'Times New Roman'; font-size:12pt">您在区块量化浏览交易信息时，应当仔细阅读交易信息中包含的全部内容，包括但不限于价格、委托量、手续费、买入或卖出方向，您完全接受交易信息中包含的全部内容后方可点击按钮进行交易。</span></p>
                    <p style="margin:0pt"><span style="font-family:'Times New Roman'; font-size:12pt">&nbsp;</span></p>
                    <p style="margin:0pt"><span style="width:36pt; text-indent:0pt; display:inline-block"></span><span style="font-family:'Times New Roman'; font-size:12pt"> 3.3提交委托</span></p>
                    <p style="margin:0pt"><span style="width:36pt; text-indent:0pt; display:inline-block"></span><span style="width:36pt; text-indent:0pt; display:inline-block"></span><span style="font-family:'Times New Roman'; font-size:12pt">在浏览完交易信息确认无误之后您可以提交交易委托。您提交交易委托后，即您授权区块量化代理您进行相应的交易撮合，区块量化在有满足您委托价格的交易时将会自动完成撮合交易而无需提前通知您。</span></p>
                    <p style="margin:0pt"><span style="font-family:'Times New Roman'; font-size:12pt">&nbsp;</span></p>
                    <p style="margin:0pt"><span style="width:36pt; text-indent:0pt; display:inline-block"></span><span style="font-family:'Times New Roman'; font-size:12pt"> 3.4查看交易明细</span></p>
                    <p style="margin:0pt"><span style="width:36pt; text-indent:0pt; display:inline-block"></span><span style="width:36pt; text-indent:0pt; display:inline-block"></span><span style="font-family:'Times New Roman'; font-size:12pt">您可以通过管理中心的交易明细中查看相应的成交记录，确认自己的详细交易记录。</span></p>
                    <p style="margin:0pt"><span style="font-family:'Times New Roman'; font-size:12pt">&nbsp;</span></p>
                    <p style="margin:0pt"><span style="width:36pt; text-indent:0pt; display:inline-block"></span><span style="font-family:'Times New Roman'; font-size:12pt"> 3.5撤销/修改委托 在委托未达成交易之前，您有权随时撤销或修改委托。</span></p>
                    <p style="margin:0pt"><span style="font-family:'Times New Roman'; font-size:12pt">五、区块量化的权利和义务</span></p>
                    <p style="margin:0pt"><span style="width:36pt; text-indent:0pt; display:inline-block"></span><span style="font-family:'Times New Roman'; font-size:12pt">1.如您不具备本协议约定的注册资格，则区块量化有权拒绝您进行注册，对已注册的，区块量化有权注销您的用户账号，区块量化保留向您或您的有权代理人追究责任的权利。同时，区块量化保留其他任何情况下决定是否接受您注册的权利。</span></p>
                    <p style="margin:0pt"><span style="width:36pt; text-indent:0pt; display:inline-block"></span><span style="font-family:'Times New Roman'; font-size:12pt">2.“区块量化”发现账户使用者并非账户初始注册人时，有权中止或终止该账户的使用。</span></p>
                    <p style="margin:0pt"><span style="width:36pt; text-indent:0pt; display:inline-block"></span><span style="font-family:'Times New Roman'; font-size:12pt">3.“区块量化”通过技术检测、人工抽检等检测方式合理怀疑您提供的信息错误、不实、失效或不完整时，有权通知您更正、更新信息或中止、终止为您提供区块量化服务。</span></p>
                    <p style="margin:0pt"><span style="width:36pt; text-indent:0pt; display:inline-block"></span><span style="font-family:'Times New Roman'; font-size:12pt">4.“区块量化”有权在发现区块量化上显示的任何信息存在明显错误时，对信息予以更正。</span></p>
                    <p style="margin:0pt"><span style="width:36pt; text-indent:0pt; display:inline-block"></span><span style="font-family:'Times New Roman'; font-size:12pt">5.“区块量化”保留随时修改、中止或终止区块量化服务的权利，区块量化行使修改或中止服务的权利不需事先告知您；区块量化终止区块量化一项或多项服务的，终止自在区块量化上发布终止公告之日生效。</span></p>
                    <p style="margin:0pt"><span style="width:36pt; text-indent:0pt; display:inline-block"></span><span style="font-family:'Times New Roman'; font-size:12pt">6.“区块量化”应当采取必要的技术手段和管理措施保障区块量化的正常运行，并提供必要、可靠的交易环境和交易服务，维护数字资产交易秩序。</span></p>
                    <p style="margin:0pt"><span style="width:36pt; text-indent:0pt; display:inline-block"></span><span style="font-family:'Times New Roman'; font-size:12pt">7.如您连续一年未使用区块量化用户账号和密码登陆区块量化，则区块量化有权注销您的区块量化账号。账号注销后，区块量化有权将相应的用户名开放给其他用户注册使用。</span></p>
                    <p style="margin:0pt"><span style="width:36pt; text-indent:0pt; display:inline-block"></span><span style="font-family:'Times New Roman'; font-size:12pt">8.“区块量化”通过加强技术投入、提升安全防范等措施保障您的数字资产的安全，有义务在您账户出现可以预见的安全风险时提前通知您。</span></p>
                    <p style="margin:0pt"><span style="width:36pt; text-indent:0pt; display:inline-block"></span><span style="font-family:'Times New Roman'; font-size:12pt">9.“区块量化”有权随时删除区块量化内各类不符合法律法规或区块量化规定等的内容信息，区块量化行使该等权利不需提前通知您。</span></p>
                    <p style="margin:0pt"><span style="width:36pt; text-indent:0pt; display:inline-block"></span><span style="font-family:'Times New Roman'; font-size:12pt">10.“区块量化”有权根据您所属主权国家或地区的法律法规、规则、命令等规范的要求，向您要求提供更多的信息或资料等，并采取合理的措施，以符合当地的规范之要求，您有义务配合；区块量化有权根据您所属主权国家或地区的法律法规、规则、命令等规范的要求，暂停或永久停止对您的开放区块量化及其部分或全部服务。</span></p>
                    <p style="margin:0pt"><span style="font-family:'Times New Roman'; font-size:12pt">六、赔偿</span></p>
                    <p style="margin:0pt"><span style="width:36pt; text-indent:0pt; display:inline-block"></span><span style="font-family:'Times New Roman'; font-size:12pt">1.在任何情况下，我们对您的直接损害的赔偿责任均不会超过您从使用区块量化服务产生的为期三（3）个月的总费用。</span></p>
                    <p style="margin:0pt"><span style="width:36pt; text-indent:0pt; display:inline-block"></span><span style="font-family:'Times New Roman'; font-size:12pt">2.如您发生违反本协议或其他法律法规等情况，您须向我们赔偿因您的过错所导致的全部损失。</span></p>
                    <p style="margin:0pt"><span style="font-family:'Times New Roman'; font-size:12pt">&nbsp;</span></p>
                    <p style="margin:0pt"><span style="font-family:'Times New Roman'; font-size:12pt">七、寻求禁令救济的权利</span></p>
                    <p style="margin:0pt"><span style="width:36pt; text-indent:0pt; display:inline-block"></span><span style="font-family:'Times New Roman'; font-size:12pt">我们和您均承认普通法对违约或可能违约情况的救济措施是或可能是不足以弥补我们遭受的全部损失的，故一方有权在另一方违约或可能违约情况下寻求禁令救济以及普通法或衡平法允许的其他所有的补救措施。</span></p>
                    <p style="margin:0pt"><span style="font-family:'Times New Roman'; font-size:12pt">&nbsp;</span></p>
                    <p style="margin:0pt"><span style="font-family:'Times New Roman'; font-size:12pt">八、责任限制与免责</span></p>
                    <p style="margin:0pt"><span style="width:36pt; text-indent:0pt; display:inline-block"></span><span style="font-family:'Times New Roman'; font-size:12pt">1.您了解并同意，在任何情况下，我们不就以下各事项承担责任：</span></p>
                    <p style="margin:0pt"><span style="width:36pt; text-indent:0pt; display:inline-block"></span><span style="width:36pt; text-indent:0pt; display:inline-block"></span><span style="font-family:'Times New Roman'; font-size:12pt">1.1 收入的损失；</span></p>
                    <p style="margin:0pt"><span style="width:36pt; text-indent:0pt; display:inline-block"></span><span style="width:36pt; text-indent:0pt; display:inline-block"></span><span style="font-family:'Times New Roman'; font-size:12pt">1.2 交易利润或合同损失；</span></p>
                    <p style="margin:0pt"><span style="width:36pt; text-indent:0pt; display:inline-block"></span><span style="width:36pt; text-indent:0pt; display:inline-block"></span><span style="font-family:'Times New Roman'; font-size:12pt">1.3 业务中断;</span></p>
                    <p style="margin:0pt"><span style="width:36pt; text-indent:0pt; display:inline-block"></span><span style="width:36pt; text-indent:0pt; display:inline-block"></span><span style="font-family:'Times New Roman'; font-size:12pt">1.4 预期可节省的货币的损失；</span></p>
                    <p style="margin:0pt"><span style="width:36pt; text-indent:0pt; display:inline-block"></span><span style="width:36pt; text-indent:0pt; display:inline-block"></span><span style="font-family:'Times New Roman'; font-size:12pt">1.5 信息的损失；</span></p>
                    <p style="margin:0pt"><span style="width:36pt; text-indent:0pt; display:inline-block"></span><span style="width:36pt; text-indent:0pt; display:inline-block"></span><span style="font-family:'Times New Roman'; font-size:12pt">1.6 机会、商誉或声誉的损失；</span></p>
                    <p style="margin:0pt"><span style="width:36pt; text-indent:0pt; display:inline-block"></span><span style="width:36pt; text-indent:0pt; display:inline-block"></span><span style="font-family:'Times New Roman'; font-size:12pt">1.7 数据的损坏或损失；</span></p>
                    <p style="margin:0pt"><span style="width:36pt; text-indent:0pt; display:inline-block"></span><span style="width:36pt; text-indent:0pt; display:inline-block"></span><span style="font-family:'Times New Roman'; font-size:12pt">1.8 购买替代产品或服务的成本；</span></p>
                    <p style="margin:0pt"><span style="width:36pt; text-indent:0pt; display:inline-block"></span><span style="width:36pt; text-indent:0pt; display:inline-block"></span><span style="font-family:'Times New Roman'; font-size:12pt">1.9 任何由于侵权（包括过失）、违约或其他任何原因产生的间接的、特殊的或附带性的损失或损害</span></p>
                    <p style="margin:0pt"><span style="width:36pt; text-indent:0pt; display:inline-block"></span><span style="width:36pt; text-indent:0pt; display:inline-block"></span><span style="font-family:'Times New Roman'; font-size:12pt">1.1 条至1.9条均是彼此独立的。</span></p>
                    <p style="margin:0pt"><span style="width:36pt; text-indent:0pt; display:inline-block"></span><span style="font-family:'Times New Roman'; font-size:12pt">2.您了解并同意，我们不对因下述任一情况而导致您的任何损害赔偿承担责任：</span></p>
                    <p style="margin:0pt"><span style="width:36pt; text-indent:0pt; display:inline-block"></span><span style="width:36pt; text-indent:0pt; display:inline-block"></span><span style="font-family:'Times New Roman'; font-size:12pt">2.1 我们有合理的理由认为您的具体交易事项可能存在重大违法或违约情形。</span></p>
                    <p style="margin:0pt"><span style="width:36pt; text-indent:0pt; display:inline-block"></span><span style="width:36pt; text-indent:0pt; display:inline-block"></span><span style="font-family:'Times New Roman'; font-size:12pt">2.2 我们有合理的理由认为您在区块量化的行为涉嫌违法或不道德。</span></p>
                    <p style="margin:0pt"><span style="width:36pt; text-indent:0pt; display:inline-block"></span><span style="width:36pt; text-indent:0pt; display:inline-block"></span><span style="font-family:'Times New Roman'; font-size:12pt">2.3 通过区块量化服务购买或获取任何数据、信息或进行交易等行为或替代行为产生的费用及损失。</span></p>
                    <p style="margin:0pt"><span style="width:36pt; text-indent:0pt; display:inline-block"></span><span style="width:36pt; text-indent:0pt; display:inline-block"></span><span style="font-family:'Times New Roman'; font-size:12pt">2.4 您对区块量化服务的误解。</span></p>
                    <p style="margin:0pt"><span style="width:36pt; text-indent:0pt; display:inline-block"></span><span style="width:36pt; text-indent:0pt; display:inline-block"></span><span style="font-family:'Times New Roman'; font-size:12pt">2.5 任何非因我们的原因而引起的与区块量化提供的服务有关的其它损失。</span></p>
                    <p style="margin:0pt"><span style="width:36pt; text-indent:0pt; display:inline-block"></span><span style="font-family:'Times New Roman'; font-size:12pt">3.我们对由于信息网络设备维护、信息网络连接故障、电脑、通讯或其他系统的故障、电力故障、天气原因、意外事故、罢工、劳动争议、暴乱、起义、骚乱、生产力或生产资料不足、火灾、洪水、风暴、爆炸、战争、银行或其他合作方原因、数字资产市场崩溃、政府行为、 司法或行政机关的命令、其他不在我们可控范围内或我们无能力控制的行为或第三方的原因而造成的不能服务或延迟服务，以及造成的您的损失，我们不承担相关责任。</span></p>
                    <p style="margin:0pt"><span style="width:36pt; text-indent:0pt; display:inline-block"></span><span style="font-family:'Times New Roman'; font-size:12pt">4.我们不能保证区块量化包含的全部信息、程序、文本等完全安全，不受任何病毒、木马等恶意程序的干扰和破坏，故您登陆、使用区块量化任何服务或下载及使用该下载的任何程序、信息、数据等均是您个人的决定并自行承担风险及可能产生的损失。</span></p>
                    <p style="margin:0pt"><span style="width:36pt; text-indent:0pt; display:inline-block"></span><span style="font-family:'Times New Roman'; font-size:12pt">5.我们对区块量化中链接的任何第三方应用或网站的任何信息、产品及业务及其他任何形式的不属于我们的主体的内容等不做任何保证和承诺，您如果使用第三方应用或网站提供的任何服务、信息及产品等均为您个人决定且承担由此产生的一切责任。</span></p>
                    <p style="margin:0pt"><span style="width:36pt; text-indent:0pt; display:inline-block"></span><span style="font-family:'Times New Roman'; font-size:12pt">6.我们对于您使用区块量化服务不做任何明示或暗示的保证，包括但不限于区块量化提供服务的适用性、没有错误或疏漏、持续性、准确性、可靠性、适用于某一特定用途。同时，我们也不对区块量化提供的服务所涉及的技术及信息的有效性、准确性、正确性、可靠性、质量、稳定、完整和及时性作出相关承诺和保证。是否登陆或使用区块量化提供的服务是您个人的决定且自行承担风险及可能产生的损失。我们对于数字资产的市场、价值及价格等不做任何明示或暗示的保证，您理解并了解数字资产市场是不稳定的，价格和价值随时会大幅波动或崩盘，交易数字资产是您个人的自由选择及决定且自行承担风险及可能产生的损失。</span></p>
                    <p style="margin:0pt"><span style="width:36pt; text-indent:0pt; display:inline-block"></span><span style="font-family:'Times New Roman'; font-size:12pt">7.本协议中规定的我们的保证和承诺是由我们就本协议和区块量化提供的服务的唯一保证和陈述，并取代任何其他途径和方式产生的保证和承诺，无论是书面的或口头的， 明示的或暗示的。所有这些保证和陈述仅仅代表我们自身的承诺和保证，并不保证任何第三方遵守本协议中的保证和承诺。</span></p>
                    <p style="margin:0pt"><span style="width:36pt; text-indent:0pt; display:inline-block"></span><span style="font-family:'Times New Roman'; font-size:12pt">8.我们并不放弃本协议中未提及的在法律适用的最大范围内我们享有的限制、免除或抵销我们损害赔偿责任的任何权利。</span></p>
                    <p style="margin:0pt"><span style="width:36pt; text-indent:0pt; display:inline-block"></span><span style="font-family:'Times New Roman'; font-size:12pt">9.您注册后即表示认可我们按照本协议中规定的规则进行的任何操作，产生的任何风险均由您承担。</span></p>
                    <p style="margin:0pt"><span style="font-family:'Times New Roman'; font-size:12pt">九、协议的终止</span></p>
                    <p style="margin:0pt"><span style="width:36pt; text-indent:0pt; display:inline-block"></span><span style="font-family:'Times New Roman'; font-size:12pt">1.“区块量化”有权依据本协议约定注销您的区块量化账号，本协议于账号注销之日终止（有关争议解决的条款除外）。</span></p>
                    <p style="margin:0pt"><span style="width:36pt; text-indent:0pt; display:inline-block"></span><span style="font-family:'Times New Roman'; font-size:12pt">2.“区块量化”有权依据本协议约定终止全部区块量化服务，本协议于区块量化全部服务终止之日终止（有关争议解决的条款除外）。</span></p>
                    <p style="margin:0pt"><span style="width:36pt; text-indent:0pt; display:inline-block"></span><span style="font-family:'Times New Roman'; font-size:12pt">3.本协议终止后，您无权要求区块量化继续向您提供任何服务或履行任何其他义务，包括但不限于要求区块量化为您保留或向您披露原区块量化账号中的任何信息，向您或第三方转发任何其未曾阅读或发送过的信息等。</span></p>
                    <p style="margin:0pt"><span style="font-family:'Times New Roman'; font-size:12pt">十、知识产权</span></p>
                    <p style="margin:0pt"><span style="width:36pt; text-indent:0pt; display:inline-block"></span><span style="font-family:'Times New Roman'; font-size:12pt">1.本公司是“区块量化”知识产权的权利所有人。“区块量化”所包含的全部智力成果包括但不限于区块量化的标志、数据库、应用设计、文字和图表、软件、照片、录像、音乐、声音及其前述组合，软件编译、相关源代码和软件(包括小应用程序和脚本) 的知识产权权利均归公司所有。您不得为商业目的复制、更改、拷贝、发送或使用前述任何材料或内容。</span></p>
                    <p style="margin:0pt"><span style="width:36pt; text-indent:0pt; display:inline-block"></span><span style="font-family:'Times New Roman'; font-size:12pt">2.“区块量化”名称中包含的所有权利(包括但不限于商誉和商标、标志) 均归公司所有。</span></p>
                    <p style="margin:0pt"><span style="width:36pt; text-indent:0pt; display:inline-block"></span><span style="font-family:'Times New Roman'; font-size:12pt">3.您接受本协议即视为您主动将其在区块量化发表的任何形式的信息的著作权，包括但不限于：复制权、发行权、出租权、展览权、表演权、放映权、广播权、信息网络传播权、摄制权、改编权、翻译权、汇编权 以及应当由著作权人享有的其他可转让权利无偿独家转让给公司所有，公司有权利就任何主体侵权单独提起诉讼并获得全部赔偿。 本协议效力及于您在区块量化发布的任何受著作权法保护的作品内容，无论该内容形成于本协议签订前还是本协议签订后。</span></p>
                    <p style="margin:0pt"><span style="width:36pt; text-indent:0pt; display:inline-block"></span><span style="font-family:'Times New Roman'; font-size:12pt">4.您在使用区块量化服务过程中不得非法使用或处分公司或他人的知识产权权利。您不得将已发表于区块量化的信息以任何形式发布或授权其它应用或网站（及媒体）使用。</span></p>
                    <p style="margin:0pt"><span style="width:36pt; text-indent:0pt; display:inline-block"></span><span style="font-family:'Times New Roman'; font-size:12pt">5.您登陆区块量化或使用区块量化提供的任何服务均不视为我们向您转让任何知识产权。</span></p>
                    <p style="margin:0pt"><span style="width:36pt; text-indent:0pt; display:inline-block"></span><span style="font-family:'Times New Roman'; font-size:12pt">6.上述知识产权均受知识产权注册地法律法规和相应的国际条约保护，本公司享有上述知识产权，但相关权利人依照法律规定应享有的权利除外</span></p>
                    <p style="margin:0pt"><span style="font-family:'Times New Roman'; font-size:12pt">十一、用户信息和隐私保护</span></p>
                    <p style="margin:0pt"><span style="width:36pt; text-indent:0pt; display:inline-block"></span><span style="font-family:'Times New Roman'; font-size:12pt">1.适用范围</span></p>
                    <p style="margin:0pt"><span style="width:36pt; text-indent:0pt; display:inline-block"></span><span style="width:36pt; text-indent:0pt; display:inline-block"></span><span style="font-family:'Times New Roman'; font-size:12pt">1.1 在您注册区块量化账号或者使用账户时，您根据区块量化要求提供的个人注册信息，包括但不限于电话号码、邮箱信息、身份证件信息。</span></p>
                    <p style="margin:0pt"><span style="width:36pt; text-indent:0pt; display:inline-block"></span><span style="width:36pt; text-indent:0pt; display:inline-block"></span><span style="font-family:'Times New Roman'; font-size:12pt">1.2 在您使用区块量化服务时，或访问区块量化网页时，区块量化自动接收并记录的您浏览器上的服务器数值，包括但不限于IP地址等数据及您要求取用的网页记录</span></p>
                    <p style="margin:0pt"><span style="width:36pt; text-indent:0pt; display:inline-block"></span><span style="width:36pt; text-indent:0pt; display:inline-block"></span><span style="font-family:'Times New Roman'; font-size:12pt">1.3区块量化收集到的您在区块量化进行交易的有关数据，包括但不限于交易记录。</span></p>
                    <p style="margin:0pt"><span style="width:36pt; text-indent:0pt; display:inline-block"></span><span style="width:36pt; text-indent:0pt; display:inline-block"></span><span style="font-family:'Times New Roman'; font-size:12pt">1.4区块量化通过合法途径取得的其他您个人信息。</span></p>
                    <p style="margin:0pt"><span style="width:36pt; text-indent:0pt; display:inline-block"></span><span style="font-family:'Times New Roman'; font-size:12pt">2.信息使用</span></p>
                    <p style="margin:0pt"><span style="width:36pt; text-indent:0pt; display:inline-block"></span><span style="width:36pt; text-indent:0pt; display:inline-block"></span><span style="font-family:'Times New Roman'; font-size:12pt">2.1 不需要您额外的同意，您在区块量化注册成功即视为您同意区块量化收集并使用其在区块量化的各类信息，如11.1条所列，您了解并同意，区块量化可以将收集的您信息用作包括但不限于下列用途：</span></p>
                    <p style="margin:0pt"><span style="width:36pt; text-indent:0pt; display:inline-block"></span><span style="width:36pt; text-indent:0pt; display:inline-block"></span><span style="font-family:'Times New Roman'; font-size:12pt">2.1.1 向您提供区块量化服务；</span></p>
                    <p style="margin:0pt"><span style="width:36pt; text-indent:0pt; display:inline-block"></span><span style="width:36pt; text-indent:0pt; display:inline-block"></span><span style="font-family:'Times New Roman'; font-size:12pt">2.1.2 基于主权国家或地区相关主管部门的要求向相关部门进行报告；</span></p>
                    <p style="margin:0pt"><span style="width:36pt; text-indent:0pt; display:inline-block"></span><span style="width:36pt; text-indent:0pt; display:inline-block"></span><span style="font-family:'Times New Roman'; font-size:12pt">2.1.3 在您使用区块量化服务时，区块量化将您的信息用于身份验证、客户服务、安全防范、诈骗监测、市场推广、存档和备份用途，或与第三方合作推广区块量化等合法用途，确保区块量化向您提供的产品和服务的安全性；</span></p>
                    <p style="margin:0pt"><span style="width:36pt; text-indent:0pt; display:inline-block"></span><span style="width:36pt; text-indent:0pt; display:inline-block"></span><span style="font-family:'Times New Roman'; font-size:12pt">2.1.4 帮助区块量化设计新产品及服务，改善区块量化现有服务目的而进行的信息收集和整理；</span></p>
                    <p style="margin:0pt"><span style="width:36pt; text-indent:0pt; display:inline-block"></span><span style="width:36pt; text-indent:0pt; display:inline-block"></span><span style="font-family:'Times New Roman'; font-size:12pt">2.1.5为了使您了解区块量化服务的具体情况，您同意区块量化向其发送营销活动通知、商业性电子信息以及提供与您相关的广告以替代普遍投放的广告；</span></p>
                    <p style="margin:0pt"><span style="width:36pt; text-indent:0pt; display:inline-block"></span><span style="width:36pt; text-indent:0pt; display:inline-block"></span><span style="font-family:'Times New Roman'; font-size:12pt">2.1.6 “区块量化”为完成合并、分立、收购或资产转让而将您的信息转移或披露给任何非关联的第三方；</span></p>
                    <p style="margin:0pt"><span style="width:36pt; text-indent:0pt; display:inline-block"></span><span style="width:36pt; text-indent:0pt; display:inline-block"></span><span style="font-family:'Times New Roman'; font-size:12pt">2.1.7 软件认证或管理软件升级；</span></p>
                    <p style="margin:0pt"><span style="width:36pt; text-indent:0pt; display:inline-block"></span><span style="width:36pt; text-indent:0pt; display:inline-block"></span><span style="font-family:'Times New Roman'; font-size:12pt">2.1.8 邀请您参与有关区块量化服务的调查；</span></p>
                    <p style="margin:0pt"><span style="width:36pt; text-indent:0pt; display:inline-block"></span><span style="width:36pt; text-indent:0pt; display:inline-block"></span><span style="font-family:'Times New Roman'; font-size:12pt">2.1.9 用于和政府机关、公共事务机构、协会等合作的数据分析；</span></p>
                    <p style="margin:0pt"><span style="width:36pt; text-indent:0pt; display:inline-block"></span><span style="width:36pt; text-indent:0pt; display:inline-block"></span><span style="font-family:'Times New Roman'; font-size:12pt">2.1.10 用作其他一切合法目的以及经您授权的其他用途。</span></p>
                    <p style="margin:0pt"><span style="width:36pt; text-indent:0pt; display:inline-block"></span><span style="width:36pt; text-indent:0pt; display:inline-block"></span><span style="font-family:'Times New Roman'; font-size:12pt">2.2 “区块量化”不会向其他任何人出售或出借您的个人信息，除非事先得到您的许可。区块量化也不允许任何第三方以任何手段收集、编辑、出售或者无偿传播您的个人信息。</span></p>
                    <p style="margin:0pt"><span style="width:36pt; text-indent:0pt; display:inline-block"></span><span style="font-family:'Times New Roman'; font-size:12pt">3.区块量化对所获得的客户身份资料和交易信息等进行保密，不得向任何单位和个人提供客户身份资料和交易信息，应相关主权国家或地区法律法规、政令、命令等规定要求区块量化提供的除外。</span></p>
                    <p style="margin:0pt"><span style="font-family:'Times New Roman'; font-size:12pt">十二、计算所有的交易计算结果都经过我们的核实，所有的计算方法都已经在区块量化上公示，但是我们不能保证区块量化的使用不会受到干扰或没有误差。</span></p>
                    <p style="margin:0pt"><span style="font-family:'Times New Roman'; font-size:12pt">十三、出口控制用户理解并承认，，您不得将区块量化上的任何材料（包括软件）出口、再出口、进口或转移，故您保证不会主动实施或协助或参与任何上述违反法律法规的出口或有关转移或其他违反适用的法律和法规的行为；如发现此类情形，会向我们积极报告并协助我们处理。</span></p>
                    <p style="margin:0pt"><span style="font-family:'Times New Roman'; font-size:12pt">十四、转让本协议中约定的权利及义务同样约束从该权利义务中获取到利益的各方的受让人，继承人，遗嘱执行人和管理员。您不得在我们不同意的前提下转让给任何第三人，但我们可随时将我们在本协议中的权利和义务转让给任何第三人，并给予您提前30天的通知</span></p>
                    <p style="margin:0pt"><span style="font-family:'Times New Roman'; font-size:12pt">十五、可分割性如本协议中的任何条款被任何有管辖权的法院认定为不可执行的，无效的或非法的，并不影响本协议的其余条款的效力。</span></p>
                    <p style="margin:0pt"><span style="font-family:'Times New Roman'; font-size:12pt">十六、非代理关系本协议中的任何规定均不可被认为创造了、暗示了或以其他方式将我们视为您的代理人、受托人或其他代表人，本协议有其他规定的除外。</span></p>
                    <p style="margin:0pt"><span style="font-family:'Times New Roman'; font-size:12pt">十七、弃权我们或您任何一方对追究本协议约定的违约责任或其他责任的弃权并不能认定或解释为对其他违约责任的弃权；未行使任何权利或救济不得以任何方式被解释为对该等权利或救济的放弃。</span></p>
                    <p style="margin:0pt"><span style="font-family:'Times New Roman'; font-size:12pt">十八、标题所有标题仅供协议表述方便，并不用于扩大或限制该协议条款的内容或范围。</span></p>
                    <p style="margin:0pt"><span style="font-family:'Times New Roman'; font-size:12pt">十九、适用法律本协议全部内容均为根据中华人民共和国订立的合同，其成立、解释、内容及执行均适用中华人民共和国法律规定。</span></p>
                    <p style="margin:0pt"><span style="font-family:'Times New Roman'; font-size:12pt">二十、协议的生效和解释</span></p>
                    <p style="margin:0pt"><span style="width:36pt; text-indent:0pt; display:inline-block"></span><span style="font-family:'Times New Roman'; font-size:12pt">1.本协议于您点击区块量化注册页面的同意注册并完成注册程序、获得区块量化账号和密码时生效，对公司和您均具有约束力。</span></p>
                    <p style="margin:0pt"><span style="width:36pt; text-indent:0pt; display:inline-block"></span><span style="font-family:'Times New Roman'; font-size:12pt">2.本协议的最终解释权归公司所有。</span></p>
                    <p style="margin:0pt"><span style="font-family:'Times New Roman'; font-size:12pt">&nbsp;</span></p>
                    <p style="margin:0pt"><span style="font-family:'Times New Roman'; font-size:12pt">了解你的客户和反洗钱政策</span></p>
                    <p style="margin:0pt"><span style="font-family:'Times New Roman'; font-size:12pt">一、导言</span></p>
                    <p style="margin:0pt"><span style="width:36pt; text-indent:0pt; display:inline-block"></span><span style="font-family:'Times New Roman'; font-size:12pt">1.我们保证审慎遵守“了解你的客户”和反洗钱相关的法律法规且不得故意违反该《了解你的客户和反洗钱政策》。在我们合理控制的范围内我们将采取必要的措施和技术为您提供安全的服务，尽可能使您免于遭受犯罪嫌疑人的洗钱行为带来的损失。</span></p>
                    <p style="margin:0pt"><span style="width:36pt; text-indent:0pt; display:inline-block"></span><span style="font-family:'Times New Roman'; font-size:12pt">2.我们的了解你的客户和反洗钱政策是一个综合性的国际政策体系，包括您隶属的不同法域的了解你的客户和反洗钱政策。我们健全合规的框架确保我们在本地和全球层面均符合监管要求和监管水平，并确保区块量化持续性运行。</span></p>
                    <p style="margin:0pt"><span style="font-family:'Times New Roman'; font-size:12pt">&nbsp;</span></p>
                    <p style="margin:0pt"><span style="font-family:'Times New Roman'; font-size:12pt">二、了解你的客户和反洗钱政策如下：</span></p>
                    <p style="margin:0pt"><span style="width:36pt; text-indent:0pt; display:inline-block"></span><span style="font-family:'Times New Roman'; font-size:12pt">1.颁布了解你的客户和反洗钱政策并时时更新以满足相应的法律法规规定的标准；</span></p>
                    <p style="margin:0pt"><span style="width:36pt; text-indent:0pt; display:inline-block"></span><span style="font-family:'Times New Roman'; font-size:12pt">2.颁布和更新运行区块量化的一些指导原则和规则，且我们的员工将按照该原则和规则的指导提供服务；</span></p>
                    <p style="margin:0pt"><span style="width:36pt; text-indent:0pt; display:inline-block"></span><span style="font-family:'Times New Roman'; font-size:12pt">3.设计并完成内部监测和控制交易的程序，如以严格的手段验证身份，安排组建专业团队专门负责反洗钱工作；</span></p>
                    <p style="margin:0pt"><span style="width:36pt; text-indent:0pt; display:inline-block"></span><span style="font-family:'Times New Roman'; font-size:12pt">4.采用风险预防的方法对客户进行尽职调查和持续的监督;</span></p>
                    <p style="margin:0pt"><span style="width:36pt; text-indent:0pt; display:inline-block"></span><span style="font-family:'Times New Roman'; font-size:12pt">5.审查和定期检查已发生的交易;</span></p>
                    <p style="margin:0pt"><span style="width:36pt; text-indent:0pt; display:inline-block"></span><span style="font-family:'Times New Roman'; font-size:12pt">6.向主管当局报告可疑交易;</span></p>
                    <p style="margin:0pt"><span style="width:36pt; text-indent:0pt; display:inline-block"></span><span style="font-family:'Times New Roman'; font-size:12pt">7.身份证明文件、地址证明文件和交易记录的证明文件将会维持至少六年，如被提交给监管部门，恕不另行通知您；</span></p>
                    <p style="margin:0pt"><span style="width:36pt; text-indent:0pt; display:inline-block"></span><span style="font-family:'Times New Roman'; font-size:12pt">8.整个交易过程中，信用卡被禁止使用.</span></p>
                    <p style="margin:0pt"><span style="font-family:'Times New Roman'; font-size:12pt">&nbsp;</span></p>
                    <p style="margin:0pt"><span style="font-family:'Times New Roman'; font-size:12pt">三、身份信息与核实确认</span></p>
                    <p style="margin:0pt"><span style="width:36pt; text-indent:0pt; display:inline-block"></span><span style="font-family:'Times New Roman'; font-size:12pt">1.身份信息</span></p>
                    <p style="margin:0pt"><span style="width:36pt; text-indent:0pt; display:inline-block"></span><span style="width:36pt; text-indent:0pt; display:inline-block"></span><span style="font-family:'Times New Roman'; font-size:12pt">1.1 根据不同的司法管辖区的不同规定及不同的实体类型，我们收集的您的信息内容可能不一致，原则上将向注册的个人收集以下信息:</span></p>
                    <p style="margin:0pt"><span style="width:36pt; text-indent:0pt; display:inline-block"></span><span style="width:36pt; text-indent:0pt; display:inline-block"></span><span style="font-family:'Times New Roman'; font-size:12pt">个人基本信息：您的姓名，住址（及永久地址，如果不同），出生日期及国籍等可获得的其他情况。身份验证应该是根据官方或其他类似权威机构发放的文件，比如护照，身份证或其他不同的辖区要求的和引发的身份证明文件。您提供的地址将使用适当的方法进行验证，比如检查乘用交通工具的票据或利率票据或检查选民登记册等。</span></p>
                    <p style="margin:0pt"><span style="width:36pt; text-indent:0pt; display:inline-block"></span><span style="width:36pt; text-indent:0pt; display:inline-block"></span><span style="font-family:'Times New Roman'; font-size:12pt">有效的照片：在您注册之前，您须提供您将您的身份证件放在胸前的照片；</span></p>
                    <p style="margin:0pt"><span style="width:36pt; text-indent:0pt; display:inline-block"></span><span style="width:36pt; text-indent:0pt; display:inline-block"></span><span style="font-family:'Times New Roman'; font-size:12pt">联系方式：电话/手机号码和/或有效的电子邮件地址。</span></p>
                    <p style="margin:0pt"><span style="width:36pt; text-indent:0pt; display:inline-block"></span><span style="width:36pt; text-indent:0pt; display:inline-block"></span><span style="font-family:'Times New Roman'; font-size:12pt">1.2如果您是一个公司或其他合法实体，我们将收集以下信息以确定您或信托帐户的最终受益人。</span></p>
                    <p style="margin:0pt"><span style="width:36pt; text-indent:0pt; display:inline-block"></span><span style="width:36pt; text-indent:0pt; display:inline-block"></span><span style="font-family:'Times New Roman'; font-size:12pt">公司注册、登记证；公司的章程与备忘录副本；公司的股权机构和所有权说明的详细证明材料，证明决定区块量化账户的开立以及执行的授权委托人的董事会决议；按照要求需要提供的公司董事、大股东及区块量化账户有权签字人的身份证明文件；该公司的主要营业地址，如果与公司的邮寄地址不同，提供邮寄地址。如果公司在本地的地址与它的主要营业地址不一致的，则被视为风险较高的客户，需要提交额外附加文件。</span></p>
                    <p style="margin:0pt"><span style="width:36pt; text-indent:0pt; display:inline-block"></span><span style="width:36pt; text-indent:0pt; display:inline-block"></span><span style="font-family:'Times New Roman'; font-size:12pt">根据不同的司法管辖区的不同规定及不同的实体类型，我们要求的其他认证和权威部门发布的文件以及我们认为必要的文件。</span></p>
                    <p style="margin:0pt"><span style="width:36pt; text-indent:0pt; display:inline-block"></span><span style="width:36pt; text-indent:0pt; display:inline-block"></span><span style="font-family:'Times New Roman'; font-size:12pt">1.3 我们只接受英语版本或汉语版本的身份信息，如不是，请您将您的身份信息翻译成英文的版本并加以公证。</span></p>
                    <p style="margin:0pt"><span style="width:36pt; text-indent:0pt; display:inline-block"></span><span style="font-family:'Times New Roman'; font-size:12pt">2.确认核实</span></p>
                    <p style="margin:0pt"><span style="width:36pt; text-indent:0pt; display:inline-block"></span><span style="width:36pt; text-indent:0pt; display:inline-block"></span><span style="font-family:'Times New Roman'; font-size:12pt">2.1我们要求您提供身份证明文件的全部页面内容。</span></p>
                    <p style="margin:0pt"><span style="width:36pt; text-indent:0pt; display:inline-block"></span><span style="width:36pt; text-indent:0pt; display:inline-block"></span><span style="font-family:'Times New Roman'; font-size:12pt">2.2我们要求您提供您将您的身份证明文件放在您胸前的照片。</span></p>
                    <p style="margin:0pt"><span style="width:36pt; text-indent:0pt; display:inline-block"></span><span style="width:36pt; text-indent:0pt; display:inline-block"></span><span style="font-family:'Times New Roman'; font-size:12pt">2.3证明文件的副本一般应核和原始凭证进行核对。然而，如果某个可信赖的合适的认证人可证明该副本文件是原始文件准确而全面的复制的，该副本可接受。这样的认证人包括大使、司法委员、地方治安官等。</span></p>
                    <p style="margin:0pt"><span style="width:36pt; text-indent:0pt; display:inline-block"></span><span style="width:36pt; text-indent:0pt; display:inline-block"></span><span style="font-family:'Times New Roman'; font-size:12pt">2.4对识别最终受益人和账户控制权的要求是确定哪些个人最终所有或控制直接客户，和/或确定正在进行的交易是由他人代为执行。如果是企业，则大股东的身份（例如那些持有10％或以上的投票权益）应被验证。一般，持股25％会被认定为正常风险内，其股东身份须验证；持股10%或拥有更多的投票权或股票时被认定为高风险的情况，股东身份须加以验证。</span></p>
                    <p style="margin:0pt"><span style="font-family:'Times New Roman'; font-size:12pt">四、监控交易</span></p>
                    <p style="margin:0pt"><span style="width:36pt; text-indent:0pt; display:inline-block"></span><span style="font-family:'Times New Roman'; font-size:12pt">1.我们根据安全性和实际交易情况时时设置和调整日常交易和提币最高限额;</span></p>
                    <p style="margin:0pt"><span style="width:36pt; text-indent:0pt; display:inline-block"></span><span style="font-family:'Times New Roman'; font-size:12pt">2.如果交易频繁集中发生在某个注册用户或存在超乎合理的情况，我们的专业团队将评估并决定他们是否可疑;</span></p>
                    <p style="margin:0pt"><span style="width:36pt; text-indent:0pt; display:inline-block"></span><span style="font-family:'Times New Roman'; font-size:12pt">3.我们凭借自身的判断认定为可疑交易的情况，我们可能会采取暂停该交易、拒绝该交易等限制性措施，甚至如果可能将尽快逆转该交易，同时向主管部门报告，但不会通知您;</span></p>
                    <p style="margin:0pt"><span style="width:36pt; text-indent:0pt; display:inline-block"></span><span style="font-family:'Times New Roman'; font-size:12pt">4.我们保留拒绝来自于不符合国际反洗钱标准辖区的人或可被视为政治公众人物的人的注册申请，我们保留随时暂停或终止根据我们自身判断为可疑交易的交易，但我们这样做并不违反对您的任何义务和责任。</span></p>
                    <p style="margin:0pt"><span style="font-family:'Times New Roman'; font-size:12pt">其他</span></p>
                    <p style="margin:0pt"><span style="width:36pt; text-indent:0pt; display:inline-block"></span><span style="font-family:'Times New Roman'; font-size:12pt">1.你使用本软件即视为你已阅读并同意受本协议的约束。本公司有权在必要时修改本协议条款。你可以在本软件的最新版本中查阅相关协议条款。本协议条款变更后，如果你继续使用本软件，即视为你已接受修改后的协议。如果你不接受修改后的协议，应当停止使用本软件。</span></p>
                    <p style="margin:0pt"><span style="width:36pt; text-indent:0pt; display:inline-block"></span><span style="font-family:'Times New Roman'; font-size:12pt">2.本协议的成立、生效、履行、解释及纠纷解决，适用中华人民共和国大陆地区法律（不包括冲突法）。</span></p>
                    <p style="margin:0pt"><span style="width:36pt; text-indent:0pt; display:inline-block"></span><span style="font-family:'Times New Roman'; font-size:12pt">3.若你和本公司之间发生任何纠纷或争议，首先应友好协商解决；协商不成的，你同意将纠纷或争议提交本协议签订地有管辖权的人民法院管辖。</span></p>
                    <p style="margin:0pt"><span style="width:36pt; text-indent:0pt; display:inline-block"></span><span style="font-family:'Times New Roman'; font-size:12pt">4.本协议所有条款的标题仅为阅读方便，本身并无实际涵义，不能作为本协议涵义解释的依据。</span></p>
                    <p style="margin:0pt"><span style="width:36pt; text-indent:0pt; display:inline-block"></span><span style="font-family:'Times New Roman'; font-size:12pt">5.本协议条款无论因何种原因部分无效或不可执行，其余条款仍有效，对双方具有约束力。</span></p>
                    <p style="margin:0pt"><span style="font-family:'Times New Roman'; font-size:12pt">&nbsp;</span></p>
                    </div>
                    <div class="textBtn"  @click="text(false)">确定</div>
            </div>
        </van-popup>
    </div>
</template>

<script>
import '../assets/js/jquery.js'
import '../assets/js/gt.js'
import axios from 'axios'
import { Field,Cell,Button,Checkbox,CheckboxGroup,Popup  } from 'vant'
import { post,toast,get } from '../axios/axios.js'
import '../assets/stylus/default.styl'
export default {
    name: 'Login',
    props: {
        msg: String
    },
    components:{
        [Field .name]: Field,
        [Cell.name]: Cell,
        [Button.name]: Button,
        [Checkbox.name]: Checkbox,
        [Popup.name]: Popup,
        [CheckboxGroup .name]: CheckboxGroup ,
    },
    data () {
        return {
            userPhone: '',
            codeWord: '',
            checked: true,
            show: true,
            showxieyi: false,
            count: '',
            timer: null,
            serverStatus: ''
        }
    },
    mounted() {  
            let that = this
            var  $btn = $('#btn')
            /*  处理验证事件    */
            var handler = function (captchaObj) {
                captchaObj.onReady(function () {
                    console.info('geetest has load')       
                }).onClose(function () {
                    toast('请完成验证')
                }).onSuccess(function () {
                    let result = captchaObj.getValidate();
                    if (!result) { 
                        return toast('验证未通过，请重试')
                    }  
                    post('/quantitativeTrade/user/second-auth', {
                        geetest_challenge: result.geetest_challenge,
                        geetest_validate: result.geetest_validate,
                        geetest_seccode: result.geetest_seccode,
                        clientType: "web",
                        username: that.userPhone,
                        serverStatus: that.serverStatus
                    }).then(res => {
                        post('/quantitativeTrade/sms/send', {
                            phone: that.userPhone
                        }).then(res => {
                            if (res.code === 200) {
                                toast('发送成功请注意查收')
                            }else {
                                toast(res.message)
                            }
                        }).catch(function (error) {
                            console.log(error)
                        })
                    }).catch(function (error) {
                        console.log(error)
                    })
                });
                let reg = /^[1][3,4,5,7,8,9][0-9]{9}$/
                $btn.click(function () {
                    if (that.userPhone === '') {
                        toast('请输入手机号码')
                        return false
                    } else if (!reg.test(that.userPhone)) {
                        toast('请输入正确的手机号码')
                        return false
                    } else {
                        captchaObj.verify();
                    }
                });
            };
            get('/quantitativeTrade/user/first-auth', {
                username: '',
                clientType: 'web'
            }).then(res => {
                that.serverStatus = res.data.serverStatus
                initGeetest({
                    // 以下 4 个配置参数为必须，不能缺少
                    gt: res.data.gt,
                    challenge: res.data.challenge,
                    offline: !res.data.success, // 表示用户后台检测极验服务器是否宕机
                    product: "bind", // 产品形式，包括：float，popup
                    https: true
                }, handler);
            }).catch(function (error) {
                console.log(error)
            })
    },
    methods:{
        text(val) {
            this.showxieyi = val
        },
        xieyi(val) {
            this.checked = val
        },
        getCode(){ // 登录获取验证码
            let that = this
            const thime_count = 60
            let reg = /^[1][3,4,5,7,8,9][0-9]{9}$/
            if (that.userPhone === '') {
                toast('请输入手机号码')
                return false
            } else if (!reg.test(that.userPhone)) {
                toast('请输入正确的手机号码')
                return false
            } else {
                if (!that.timer) {
                    that.count = thime_count
                    that.show = false
                    that.timer = setInterval(() => {
                        if (that.count > 0 && that.count <= thime_count) {
                            that.count--
                        } else {
                            that.show = true;
                            clearInterval(that.timer)
                            that.timer = null
                        }
                    }, 1000)
                }
                get('/quantitativeTrade/user/first-auth', {
                    username: that.userPhone,
                    clientType: 'web'
                }).then(res => {
                    console.log(res);
                    
                }).catch(function (error) {
                    console.log(error)
                })
            }
            
        },
        postLogin() { // 登录
            let that = this
            let reg = /^[1][3,4,5,7,8][0-9]{9}$/
            if (that.userPhone === '' || that.codeWord === '') {
                toast('请输入账户或者验证码')
                return false
            } else if (!reg.test(that.userPhone)) {
                toast('请输入正确的手机号码')
                return false
            } else if (that.checked === false) {
                toast('请同意《量化盒子平台服务使用协议及隐私政策》')
                return false
            } else {
                let databody = {
                    "phone": that.userPhone,
                    "code": that.codeWord
                }
                post('/quantitativeTrade/user/login', databody, '登陆中...').then(res => {
                    if (res.code === 200) {
                        toast('登录成功')
                        localStorage.setItem('LZdata',JSON.stringify(res.data))
                        localStorage.setItem('LZtoken',res.data.token)
                        that.$store.commit('setNick', res.data.nick)
                        that.$store.commit('setAvatar', res.data.avatar)
                        that.$store.commit('setFlag', res.data.flag)
                        setTimeout(() => {
                            that.$router.push('/Home')
                        },2000)
                    }else {
                        toast(res.message)
                    }
                }).catch(function (error) {
                    console.log(error)
                })
            }
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped>
.Login
    background-image url('../assets/img/login.png')
    position absolute
    width 100%
    height 100%
    background-repeat no-repeat
    background-size 100% 100%
    top 0
    left 0
    .LoginBox
        width 90%
        position absolute
        left 50%
        top 42%
        transform translate(-50%,-50%)
        .LoginName
            font-size 24px
            margin-bottom 18px
            color #fff
        .borderR
            border-top-left-radius: 8px;
            border-top-right-radius: 8px;
            height 50px
        .borderR2
            border-bottom-left-radius: 8px;
            border-bottom-right-radius: 8px;
        .input
            font-size 14px
            >>>.van-cell__value
                line-height 30px
            >>> .van-button
                background-color transparent 
                border none
                color #007EFF
                font-size 14px
        .checkbox
            display flex
            align-items center
            .checked
                margin 15px 0px
            .checkboxT
                flex 1
                color #ffffff
                line-height 1
                text-align left
                padding 0 8px
    >>>.van-popup
        width 100%
        height 100%
        font-size 14px
        text-align left
        .textBtn
            height 30px
            background linear-gradient(269deg,rgba(30,219,142,1),rgba(0,168,255,1))
            line-height 30px
            width 60%
            border navajowhite
            font-size 14px
            color #fff
            text-align center
            margin 0 auto 20px auto
</style>
