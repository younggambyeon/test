package com.younggambyeon.test.service;

import java.security.KeyFactory;
import java.security.KeyPair;
import java.security.KeyPairGenerator;
import java.security.PrivateKey;
import java.security.PublicKey;
import java.security.spec.RSAPublicKeySpec;

import javax.crypto.Cipher;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.younggambyeon.test.dto.User;

public class EncryptionServiceImpl implements EncryptionService {

	private static final Logger logger = LoggerFactory.getLogger(EncryptionServiceImpl.class);

	public static String RSA_WEB_KEY = "RSA_WEB_Key";
	public static String RSA_INSTANCE = "RSA";

	@Override
	public void initKeyGenarator(HttpServletRequest request) {
		HttpSession session = request.getSession();

		KeyPairGenerator generator;
		try {
			generator = KeyPairGenerator.getInstance(RSA_INSTANCE);
			generator.initialize(1024);

			KeyPair keyPair = generator.genKeyPair();
			KeyFactory keyFactory = KeyFactory.getInstance(RSA_INSTANCE);

			PublicKey publicKey = keyPair.getPublic();
			PrivateKey privateKey = keyPair.getPrivate();

			session.setAttribute(RSA_WEB_KEY, privateKey);

			RSAPublicKeySpec publicSpec = (RSAPublicKeySpec) keyFactory.getKeySpec(publicKey, RSAPublicKeySpec.class);
			String publicKeyModulus = publicSpec.getModulus().toString(16);
			String publicKeyExponent = publicSpec.getPublicExponent().toString(16);

			request.setAttribute("RSAModulus", publicKeyModulus);
			request.setAttribute("RSAExponent", publicKeyExponent);

		} catch (Exception e) {
			logger.error("#Error => " + e.getMessage());
		}
	}

	@Override
	public User decryptUser(HttpServletRequest req, String id, String password) {
		HttpSession session = req.getSession();
		PrivateKey privateKey = (PrivateKey) session.getAttribute(EncryptionServiceImpl.RSA_WEB_KEY);

		User user = new User();
		try {
			user.setEmail(decryptRsa(privateKey, id));
			user.setPassword(decryptRsa(privateKey, password));
		} catch (Exception e) {
			logger.error("#Error => " + e.getMessage());
		}

		return user;
	}

	private String decryptRsa(PrivateKey privateKey, String securedValue) throws Exception {
		Cipher cipher = Cipher.getInstance(RSA_INSTANCE);
		byte[] encryptedBytes = hexToByteArray(securedValue);
		cipher.init(Cipher.DECRYPT_MODE, privateKey);
		byte[] decryptedBytes = cipher.doFinal(encryptedBytes);
		String decryptedValue = new String(decryptedBytes, "utf-8");

		return decryptedValue;
	}

	private byte[] hexToByteArray(String hex) {
		if (hex == null || hex.length() % 2 != 0) {
			return new byte[] {};
		}

		byte[] bytes = new byte[hex.length() / 2];
		for (int i = 0; i < hex.length(); i += 2) {
			byte value = (byte) Integer.parseInt(hex.substring(i, i + 2), 16);
			bytes[(int) Math.floor(i / 2)] = value;
		}
		return bytes;
	}

}
