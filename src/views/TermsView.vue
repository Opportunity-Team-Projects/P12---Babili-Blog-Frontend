<template>
    <HeaderMain />
  
    <Sidebar :collapsed="isSidebarCollapsed" @toggle="handleToggle" />
  
    <div
      v-if="!isSidebarCollapsed"
      class="overlay"
      @click="handleToggle(true)"
    ></div>

    <div class="main-content">

        <div class="terms-container">

            <div class="terms-content">

                <h1>Web Site Terms and Conditions of Use</h1>
                <div class="purple-line"></div>

                <section>
                
                    <p>These Terms of Use are a binding contract between you and Tech & Game Nexus  (“we”, “us”, “our”). 
                        It contains the rules and restrictions that govern  your use of Nexus products and services 
                        (referred to below simply  as “Nexus”).</p>
                        <br> 
                    <p>Using Nexus in any way means that you agree to all of these Terms,  and these Terms will remain in 
                        effect while you use Nexus. These  Terms include everything in this document. If you don’t agree to 
                        all of the following, you may not use or access Nexus in any manner.</p>
                    <br>
                </section>

                <section>

                    <h3>Creating an Account on Nexus</h3>  
                    
                    <p>You may be  required to sign up for an account and select a password. You promise to provide us with 
                        accurate, complete, and up-to-date registration  information about yourself. You agree that you 
                        will only use  Nexus for your own personal or organizational use, and not on behalf  of or for the 
                        benefit of any third party. You may not transfer your  account to anyone else without our prior 
                        written permission.</p>
                    <br>
                    <p>You  may not select as your Nexus account name a name that you don’t have  the right to use, or 
                        another person’s name with the intent to  impersonate that person. Nexus reserves the right to 
                        refuse  registration of or cancel a Nexus account name at its discretion.</p> 
                    <br>
                </section>

                <section>

                    <h3>Creators and Readers</h3>

                    <p>As a Nexus account holder, you are both a Creator and a Reader. As a Creator, subject to the terms 
                        of our Publisher Agreement, you can use Nexus to publish content to the web, directly to a list of  
                        subscribers that you control, and to our platform. As a Reader, you can  use your Nexus account to 
                        subscribe to or follow other Creators’  Nexus content.</p>
                    <br>
                </section>

                <section>

                    <h3>Posting Content on Nexus</h3>

                    <p>First and  foremost, you own what you create. Any original content you post,  upload, share, store, 
                        or otherwise provide to Nexus remains yours and is protected by copyright and any other applicable 
                        intellectual  property laws. </p>
                    <br>
                    <p>That includes publications, subscriber lists, any  other text or photos you upload to your subdomain 
                        on Nexus, and any  information that you provide to obtain a Nexus username and account.  It also 
                        includes any comments posted on any current or future discussion board features on Nexus. </p>
                    <br>
                    <p>Anything posted, uploaded, shared,  stored, or otherwise provided through Nexus is referred to as 
                        a “Post” in these Terms. There are a few rules that apply to all Posts:</p>
                    <ul>
                        <li>Don’t Infringe: Your Posts should not violate someone else’s (including  Nexus’s) rights. Don’t 
                            copy, reproduce, modify, translate, publish,  broadcast, transmit, distribute, perform, upload, 
                            display, license,  sell, commercialize or otherwise exploit for any purpose any content not owned 
                            by you unless you have prior consent from the owner of that  content. </li>
                        <li>Limited License to Us: In order to  display your Posts on Nexus, and to allow other users to 
                            enjoy them,  you grant us certain rights in your Posts:</li>
                        <li>Operating Nexus: You hereby grant Nexus a license to translate, modify,  reproduce, and 
                            otherwise act with respect to your Posts to enable us to  provide, improve, and notify you 
                            about new features within Nexus. You understand and agree that we may need to make changes to 
                            your Posts to  conform and adapt those Posts to the technical requirements of networks, 
                            devices, services, or media, and this license includes the rights to do so. For example, we may 
                            need to modify your publication to make sure it is viewable on an iPhone as well as a computer. </li>
                        <li>Public Posts: If you share a Post with other users on Nexus, then you grant us the license 
                            above, as well as a license to display, perform, and  distribute your Post. Also, you grant all 
                            other users of Nexus a  license to access the Post, and to use and exercise all rights in it, 
                            as permitted by the functionality of Nexus. </li>
                        <li>Term of License: You agree that the licenses you grant are royalty-free,  perpetual, irrevocable, 
                            and worldwide. This is a license only – your  ownership in Posts is not affected.</li>
                    </ul>
                    <br>
                    <p>We reserve the right to remove any content from Nexus at any time, for any reason (including, but not 
                        limited to, if someone alleges you contributed that  content in violation of these Terms), in our 
                        sole discretion, and  without notice.</p>
                    <br>
                </section>

                <section>

                    <h3>Intellectual Property and Reporting Infringement</h3>

                    <p>We respect others’ intellectual property rights, and we reserve the right  to delete or disable 
                        content alleged to be infringing, and to terminate  the accounts of repeat alleged infringers. You 
                        promise to abide by  copyright notices, trademark rules, information, and other restrictions  you 
                        may receive from us or that are posted on Nexus.</p>
                    <br>
                    <p>You understand that we own Nexus. These Terms don’t grant you any right, title or interest in Nexus, 
                        or our trademarks, logos, and other  intellectual property. </p>
                    <br>
                </section>

                <section>

                    <h3>Acceptable Use Policy</h3>

                    <p>You are responsible for  all your activity in connection with Nexus! Make sure that you use  Nexus 
                        in a manner that complies with the law. If your use of Nexus is prohibited by applicable laws, then 
                        you aren’t authorized to use  Nexus. We can’t and won’t be responsible for you using Nexus in a  
                        way that breaks the law.</p>
                    <br>
                    <p>You also agree that you will not contribute any Post or otherwise use Nexus in a manner that:</p>

                    <ul>
                        <li>Jeopardizes the security of your Nexus account or anyone else’s (such as  allowing someone else 
                            to log into Nexus as you, or sharing your  account or password with someone);</li>
                        <li>Attempts, in any manner, to obtain the password, account, or other security information of any other user;</li>
                        <li>Violates the security of any computer network, or cracks any passwords or security encryption codes.</li>
                    </ul>
                    <br>
                </section>

                <section>

                    <h3>No Warranties</h3>

                    <p>Nexus is provided to  you on an “as-is” basis. This means we provide it to you without any  express 
                        or implied warranties of any kind. That includes any implied  warranties of merchantability, 
                        warranties of fitness for a particular  purpose, non-infringement, or any warranty that the use of 
                        Nexus will be uninterrupted or error-free. Accordingly, we do not:</p>
                    <ul>
                        <li>Make any representations or warranties about any content contained in or  accessed through Nexus, 
                            and we will not be responsible for the  accuracy, copyright compliance, legality, or decency of 
                            material  contained on our products and services. </li>
                        <li>Make any representations or warranties regarding suggestions or  recommendations of products or 
                            services (including Creator publications) offered or purchased through Nexus. Products and 
                            services purchased  or offered through Nexus, including publications, are provided  “as-is” and 
                            without any warranty of any kind from Nexus. </li>
                    </ul>
                    <br>
                </section>

                <section>

                    <h3>Terminating Your Account</h3>

                    <p>Nexus is free to  terminate (or suspend access to) your use of Nexus, or your account,  for any 
                        reason at our discretion. We will try to provide advance notice to you prior to our terminating 
                        your account so that you are able to  retrieve any important Posts you may have uploaded to your 
                        account, but  we may not do so if we determine it would be impractical, illegal, not  in the 
                        interest of someone’s safety or security, or otherwise harmful to the rights or property of Nexus.</p>
                    <br>
                    <p>Nexus also allows you to delete your account at any time. If you'd like to delete your account, you 
                        can do so from your account page. When you delete your account, any Posts associated with that 
                        account  will also be deleted. However, any Post that you have made public may  remain available. </p>
                    <br>
                    <p>You understand and agree that it may not be  possible to completely delete your content from Nexus’s 
                        records or  backups, and that your Posts may remain viewable elsewhere to the extent that they were 
                        copied or stored by other users.</p>
                    <br>
                    <p>You agree that some of the obligations in these Terms will be in force even after you terminate your 
                        account. All of the following terms will  survive termination: any obligation you have to pay us or 
                        indemnify us,  any limitations on our liability, any terms regarding ownership or  intellectual 
                        property rights, terms regarding disputes between us, and  any other terms that, by their nature, 
                        should survive termination of  these Terms.</p>
                    <br>
                </section>

                <section>

                    <h3>Changes to the Terms</h3>

                    <p>We are constantly trying  to improve our products and services, so these Terms may need to change 
                        along with Nexus. We reserve the right to change the Terms at any  time, but if we do, we will 
                        bring it to your attention by placing a  notice on the website, by sending you an email, and/or by 
                        some other  means.</p>
                    <br>
                    <p>If you don’t agree with the new Terms, you are free to  reject them; unfortunately, that means you 
                        will no longer be able to use Nexus. If you use Nexus in any way after a change to the Terms is 
                        effective and notice has been provided, that means you agree to all of  the changes. </p>
                    <br>
                    <p>Except for changes by us as described here, no other amendment or modification of these Terms will 
                        be effective unless in  writing and signed by both you and us. </p>
                    <br>
                </section>

                <section>

                    <h3>Violations of the Terms</h3>

                    <p>Failure to follow any of these Terms shall constitute a breach of these Terms,  which may result in 
                        immediate termination of your account. Nexus has  the sole right to decide whether you are in 
                        violation of any of the  restrictions set forth in these Terms. </p>
                </section>

            </div>

        </div>

    </div>

</template>

<script setup>

import HeaderMain from "@/components/HeaderMain.vue";
import Sidebar from "@/components/Sidebar.vue";

</script>

<style scoped>
.main-content {
  z-index: 1;
  width: 100%;
  transition: all 0.3s ease;
  padding: 20px;
  background: radial-gradient(
    #3584e4 0%,
    #1a5fb4 15%,
    #1c71d8 34%,
    #241f31 62%,
    #000000 92%
  );
  /* background: radial-gradient(#62a0ea 0%, #1c71d8 28%, #1a5fb4 46%, #241f31 75%);*/
  color: white;
  display: flex;
  justify-content: center;
  padding-top: 43px;
  min-height: 100vh;
}

.terms-container {
    max-width: 680px;
    height: min-content;
    background-color: #1C1F26;
    border-radius: 8px;
    border: 1px solid #909090;
    display: flex;
    flex-direction: column;
    padding: 15px;
    margin: 0 10px;
}

.terms-content {
    width: 100%;
}

h1 {
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 10px;
}

.purple-line {
  height: 2px;
  background-color: #ce3df3;
  margin-bottom: 20px;
}

p {
    font-size: 14px;
}

h3 {
    font-size: 16px;
    font-weight: bold;
}

@media (max-width: 500px) {
.terms-container {
  margin: 0 5px;
  }
}
</style>