package session.services

import java.nio.charset.Charset
import java.security.SecureRandom
import java.util.Base64

import com.google.inject.Inject
import config.AuthConfig
import javax.crypto.spec.{IvParameterSpec, PBEKeySpec, SecretKeySpec}
import javax.crypto.{Cipher, Mac, SecretKeyFactory}
import session.model.Session
import session.model.SessionJsonProtocol._
import spray.json._

class CryptoService @Inject()(config: AuthConfig) {

  private def deriveSymmetricKey(salt: String): SecretKeySpec = {
    val keyFactory = SecretKeyFactory.getInstance("PBKDF2WithHmacSHA256")
    val keySpec = new PBEKeySpec(config.secret.toCharArray, salt.getBytes(), 10000, 128)
    val secretKey = keyFactory.generateSecret(keySpec)
    new SecretKeySpec(secretKey.getEncoded, "AES")
  }

  private val macKey = deriveSymmetricKey("mac key")
  private val encKey = deriveSymmetricKey("enc key")

  def hmac(value: Array[Byte], macKey: Array[Byte]): Array[Byte] = {
    val secretKeySpec = new SecretKeySpec(macKey, "HmacSHA256")
    val mac = Mac.getInstance("HmacSHA256")
    mac.init(secretKeySpec)
    mac.doFinal(value)
  }

  def encryptSession(session: Session): String = {
    val cipher = Cipher.getInstance("AES/CBC/PKCS5Padding")
    val iv = new SecureRandom().generateSeed(16)
    cipher.init(Cipher.ENCRYPT_MODE, encKey, new IvParameterSpec(iv))
    val enc = cipher.update(session.toJson.compactPrint.getBytes("UTF-8")) ++ cipher.doFinal()
    val encoder = Base64.getEncoder
    val iv64 = encoder.encodeToString(iv)
    val enc64 = encoder.encodeToString(enc)
    val encMac64 = encoder.encodeToString(hmac(enc, macKey.getEncoded))
    iv64 + "." + enc64 + "." + encMac64
  }

  def decryptSession(session: String): Option[Session] = {
    val decoder = Base64.getDecoder
    val Array(iv64, enc64, encMac64) = session.split("\\.")
    val Array(iv, enc, encMac) = Array(iv64, enc64, encMac64).map(it => decoder.decode(it))
    val mac = hmac(enc, macKey.getEncoded)
    if (encMac sameElements mac) {
      val cipher = Cipher.getInstance("AES/CBC/PKCS5Padding")
      cipher.init(Cipher.DECRYPT_MODE, encKey, new IvParameterSpec(iv))
      val dec = new String(cipher.update(enc) ++ cipher.doFinal, Charset.forName("UTF-8"))
      Some(dec.parseJson.convertTo[Session])
    } else None
  }
}
