package com.classic.imteller.api.service;

import com.classic.imteller.api.repository.User;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import javax.mail.Message;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class EmailService {
    private final JavaMailSender javaMailSender;

    public void sendMail(User user, String randomPassword){
        try {
            MimeMessage message = javaMailSender.createMimeMessage();
            message.setFrom("imteller509@gmail.com");
            message.addRecipient(Message.RecipientType.TO, new InternetAddress(user.getEmail(), user.getNickname(), "UTF-8"));
            message.setSubject("[ImTeller] " + user.getNickname() + "님 임시비밀번호 발급 메일");

            String mailForm = "<div style='width:960px; margin:0 auto;'>";
            mailForm += "<table  cellpadding='0' cellspacing='0' border='0' width='960' align='left' valign='middle' style='margin:0 auto; padding:0; min-width:960px; border:1px solid #ebebeb; font-family:'맑은 고딕', 'Malgun Gothic', '돋움', Dotum, sans-serif; font-size:18px; color:#666666; letter-spacing:-1.3px; line-height:1.8;'>";
            mailForm += "<tbody>";
            mailForm += "<tr>";
            mailForm += "<td width='70' height='80'></td>";
            mailForm += "<td width='820' height='80'></td>";
            mailForm += "<td width='70' height='80'></td>";
            mailForm += "</tr>";
            mailForm += "<tr>";
            mailForm += "<td height='30'></td>";
            mailForm += "<td height='30' align='right'>";
            mailForm += "<a href='http://j7a509.p.ssafy.io'><img src='https://ifh.cc/g/cxFvoV.png' alt='아임텔러 로고' style='height:58px;'/></a>";
            mailForm += "</td>";
            mailForm += "<td height='30'></td>";
            mailForm += "</tr>";
            mailForm += "<tr>";
            mailForm += "<td height='30'></td>";
            mailForm += "<td height='30'></td>";
            mailForm += "<td height='30'></td>";
            mailForm += "</tr>";
            mailForm += "<tr>";
            mailForm += "<td></td>";
            mailForm += "<td>";
            mailForm += "<p style='font-size:40px; color:#333333; font-weight:300; line-height:1; letter-spacing:-4px;'>임시비밀번호 안내</p>";
            mailForm += "</td>";
            mailForm += "<td></td>";
            mailForm += "</tr>";
            mailForm += "<tr>";
            mailForm += "<td height='30'></td>";
            mailForm += "<td height='30'></td>";
            mailForm += "<td height='30'></td>";
            mailForm += "</tr>";
            mailForm += "<tr>";
            mailForm += "<td></td>";
            mailForm += "<td>";
            mailForm += "<p style='font-size:16px;'>안녕하세요.<br/>" + user.getNickname() + "님이 요청하신 임시비밀번호를 안내해드립니다.<br/>해당 임시비밀번호로 로그인 후, 비밀번호를 변경해 주세요.</p>";
            mailForm += "</td>";
            mailForm += "<td></td>";
            mailForm += "</tr>";
            mailForm += "<tr>";
            mailForm += "<td height='15'></td>";
            mailForm += "<td height='15'></td>";
            mailForm += "<td height='15'></td>";
            mailForm += "</tr>";
            mailForm += "<tr>";
            mailForm += "<td></td>";
            mailForm += "<td style='padding:30px; background:#f5f5f5; text-align:center;'>";
            mailForm += "<p style='font-size:25px; font-weight:500; color:#333333;'><span style='margin-right:20px; color:#666666;'>임시비밀번호 : </span>" + randomPassword + "</p>";
            mailForm += "</td>";
            mailForm += "<td></td>";
            mailForm += "</tr>";
            mailForm += "<tr>";
            mailForm += "<td height='15'></td>";
            mailForm += "<td height='15'></td>";
            mailForm += "<td height='15'></td>";
            mailForm += "</tr>";
            mailForm += "<tr>";
            mailForm += "<td></td>";
            mailForm += "<td>";
            mailForm += "<p style='font-size:16px;'>감사합니다.</p>";
            mailForm += "</td>";
            mailForm += "<td></td>";
            mailForm += "</tr>";
            mailForm += "<tr>";
            mailForm += "<td width='70' height='80'></td>";
            mailForm += "<td width='820' height='80'></td>";
            mailForm += "<td width='70' height='80'></td>";
            mailForm += "</tr>";
            mailForm += "</tbody>";
            mailForm += "</table>";
            mailForm += "</div>";
            message.setText(mailForm, "UTF-8", "html");
            javaMailSender.send(message);
        }catch (Exception e){
            e.printStackTrace();
        }
    }
}
