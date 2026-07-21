# SimpleCommerce

Basit bir e-ticaret backend'i. C#/.NET ile katmanlı mimari (Domain → Application → Infrastructure → Api) öğrenmek amacıyla geliştirildi.

## Özellikler
- Ürünleri listeleme (fiyat, stok bilgisiyle)
- Müşteri adına satın alma (miktar seçimi, stok düşürme, ödeme kaydı)

## Teknolojiler
- .NET (ASP.NET Core Web API)
- PostgreSQL
- Dapper (ORM olarak; EF Core kullanılmadı)
- Swagger / Swashbuckle

## Mimari
Api (Controllers)
  -> Application (Services, Interfaces, DTOs)
    -> Infrastructure (Repositories, DB baglantisi)
      -> Domain (Entities)

## Calistirma
1. PostgreSQL'de simple_commerce veritabanini olustur.
2. SimpleCommerce.Api/appsettings.Development.json dosyasina kendi baglanti bilgilerini gir (bu dosya .gitignore'da, repoda yok).
3. dotnet run ile projeyi baslat.
4. /swagger adresinden endpoint'leri test et.
