using Microsoft.EntityFrameworkCore;
using XiaoJuanSchoolPayment.Server.Data;
using XiaoJuanSchoolPayment.Server.Data.DTO;
using XiaoJuanSchoolPayment.Server.Data.Filter;
using XiaoJuanSchoolPayment.Server.Interface;
using Microsoft.AspNetCore.Hosting;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory;

namespace XiaoJuanSchoolPayment.Server.Services.School
{
  public class SchoolService : ISchoolService
  {
    private const long MaxPhotoSizeBytes = 10 * 1024 * 1024;
    private static readonly HashSet<string> AllowedPhotoExtensions = new(StringComparer.OrdinalIgnoreCase)
    {
      ".jpg",
      ".jpeg",
      ".png",
      ".webp",
      ".gif",
    };
    private static readonly HashSet<string> AllowedPhotoContentTypes = new(StringComparer.OrdinalIgnoreCase)
    {
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/gif",
    };

    private readonly AppDbContext _appDbContext;
    private readonly IWebHostEnvironment _environment;

    public SchoolService(AppDbContext context, IWebHostEnvironment environment) {
      _appDbContext = context;
      _environment = environment;
    }
    public async Task<bool> SaveSchool(SchoolDTO school, CancellationToken cancellationToken)
    {
      if (school.Id == Guid.Empty)
      {
        _appDbContext.Schools.Add(new Data.Models.School
        { Name = school.Name, CreatedDate = school.CreatedDate });
      }
      else
      {
        var dbSchool = await _appDbContext.Schools.FirstOrDefaultAsync(x => x.Id == school.Id, cancellationToken);
        if (dbSchool != null)
        {
          dbSchool.Name = school.Name;
          dbSchool.CreatedDate = school.CreatedDate;
        }
      }
      await _appDbContext.SaveChangesAsync();
      return true;
    }

    public async Task<bool> SaveSchoolLesson(SchoolLessonDTO lesson, CancellationToken cancellationToken)
    {
      if (lesson.Id == Guid.Empty)
      {
        _appDbContext.SchoolLessons.Add(new Data.Models.SchoolLesson
        { 
          Name = lesson.Name,
          SchoolId = lesson.SchoolId,
          Week = lesson.Week,
          Price = lesson.Price,
          Note = lesson.Note,
          Description = lesson.Description,
          CurrencyId = lesson.CurrencyId,
          LastUpdated = DateTime.UtcNow,
        });
      }
      else
      {
        var dbLesson = await _appDbContext.SchoolLessons.FirstOrDefaultAsync(x => x.Id == lesson.Id, cancellationToken);
        if (dbLesson != null)
        {
          dbLesson.Name = lesson.Name;
          dbLesson.Week = lesson.Week;
          dbLesson.Note = lesson.Note;
          dbLesson.SchoolId = lesson.SchoolId;
          dbLesson.Price = lesson.Price;
          dbLesson.CurrencyId = lesson.CurrencyId;
          dbLesson.Description = lesson.Description;
          dbLesson.Note = lesson.Note;
          dbLesson.LastUpdated = DateTime.UtcNow;
        }
      }
      await _appDbContext.SaveChangesAsync();
      return true;
    }


    public async Task<bool> SaveSchoolRoom(SchoolRoomDTO room, CancellationToken cancellationToken)
    {
      if (room.Id == Guid.Empty)
      {
        _appDbContext.SchoolRooms.Add(new Data.Models.SchoolRoom
        {
          Name = room.Name,
          SchoolId = room.SchoolId,
          Price = room.Price,
          CurrencyId = room.CurrencyId,
          Description = room.Description,
          LastUpdated = DateTime.UtcNow,
          Week = room.Week,
        });
      }
      else
      {
        var dbRoom = await _appDbContext.SchoolRooms.FirstOrDefaultAsync(x => x.Id == room.Id, cancellationToken);
        if (dbRoom != null)
        {
          dbRoom.Name = room.Name;
          dbRoom.Week = room.Week;
          dbRoom.Description = room.Description;
          dbRoom.SchoolId = room.SchoolId;
          dbRoom.Price = room.Price;
          dbRoom.CurrencyId = room.CurrencyId;
          dbRoom.LastUpdated = DateTime.UtcNow;
        }
      }
      await _appDbContext.SaveChangesAsync();
      return true;
    }

    public async Task<bool> SaveSchoolFee(SchoolFeeDTO feeDTO, CancellationToken cancellationToken)
    {
      if (feeDTO.Id == Guid.Empty)
      {
        _appDbContext.SchoolFees.Add(new Data.Models.SchoolFee
        {
          Name = feeDTO.Name,
          SchoolId = feeDTO.SchoolId,
          Fee = feeDTO.Fee,
          CurrencyId = feeDTO.CurrencyId,
          Description = feeDTO.Description,
          LastUpdated = DateTime.UtcNow,
        });
      }
      else
      {
        var dbFee = await _appDbContext.SchoolFees.FirstOrDefaultAsync(x => x.Id == feeDTO.Id, cancellationToken);
        if (dbFee != null)
        {
          dbFee.Name = feeDTO.Name;
          dbFee.Description = feeDTO.Description;
          dbFee.SchoolId = feeDTO.SchoolId;
          dbFee.Fee = feeDTO.Fee;
          dbFee.CurrencyId = feeDTO.CurrencyId;
          dbFee.LastUpdated = DateTime.UtcNow;
        }
      }
      await _appDbContext.SaveChangesAsync();
      return true;
    }

    public async Task<bool> SaveSchoolNote(SchoolNoteDTO noteDto, CancellationToken cancellationToken)
    {
      if (noteDto.Id == Guid.Empty)
      {
        _appDbContext.SchoolNotes.Add(new Data.Models.SchoolNote
        {
          Notes = noteDto.Notes,
          SchoolId = noteDto.SchoolId,
          LastUpdated = DateTime.UtcNow,
        });
      }
      else
      {
        var dbNote = await _appDbContext.SchoolNotes.FirstOrDefaultAsync(x => x.Id == noteDto.Id, cancellationToken);
        if (dbNote != null)
        {
          dbNote.Notes = noteDto.Notes;
          dbNote.SchoolId = noteDto.SchoolId;
          dbNote.LastUpdated = DateTime.UtcNow;
        }
      }
      await _appDbContext.SaveChangesAsync();
      return true;
    }

    public async Task<SchoolPhotoDTO> UploadSchoolPhoto(SchoolPhotoUploadDTO photo, CancellationToken cancellationToken)
    {
      if (photo.SchoolId == Guid.Empty)
      {
        throw new ArgumentException("Please select a school.");
      }

      var school = await _appDbContext.Schools
        .AsNoTracking()
        .FirstOrDefaultAsync(x => x.Id == photo.SchoolId, cancellationToken);

      if (school == null)
      {
        throw new ArgumentException("The selected school was not found.");
      }

      if (photo.File == null || photo.File.Length == 0)
      {
        throw new ArgumentException("Please upload an image file.");
      }

      if (photo.File.Length > MaxPhotoSizeBytes)
      {
        throw new ArgumentException("Image files must be 10MB or smaller.");
      }

      var extension = Path.GetExtension(photo.File.FileName);
      if (string.IsNullOrWhiteSpace(extension) || !AllowedPhotoExtensions.Contains(extension))
      {
        throw new ArgumentException("Only jpg, jpeg, png, webp, and gif images are allowed.");
      }

      if (!AllowedPhotoContentTypes.Contains(photo.File.ContentType))
      {
        throw new ArgumentException("Only jpg, jpeg, png, webp, and gif images are allowed.");
      }

      var webRootPath = GetWebRootPath();
      var schoolFolderName = photo.SchoolId.ToString("N");
      var uploadFolder = Path.Combine(webRootPath, "uploads", "schools", schoolFolderName);
      Directory.CreateDirectory(uploadFolder);

      var storedFileName = $"{Guid.NewGuid():N}{extension.ToLowerInvariant()}";
      var physicalFilePath = Path.Combine(uploadFolder, storedFileName);

      await using (var stream = new FileStream(physicalFilePath, FileMode.CreateNew))
      {
        await photo.File.CopyToAsync(stream, cancellationToken);
      }

      var relativePath = Path.Combine("uploads", "schools", schoolFolderName, storedFileName)
        .Replace(Path.DirectorySeparatorChar, '/');
      var now = DateTime.UtcNow;
      var schoolPhoto = new Data.Models.SchoolPhoto
      {
        SchoolId = photo.SchoolId,
        OriginalFileName = Path.GetFileName(photo.File.FileName),
        StoredFileName = storedFileName,
        FilePath = relativePath,
        Url = $"/{relativePath}",
        ContentType = photo.File.ContentType,
        SizeBytes = photo.File.Length,
        Category = TrimToNull(photo.Category),
        Caption = TrimToNull(photo.Caption),
        AltText = TrimToNull(photo.AltText),
        DisplayOrder = photo.DisplayOrder,
        IsActive = photo.IsActive,
        CreatedAt = now,
        LastUpdated = now,
      };

      try
      {
        _appDbContext.SchoolPhotos.Add(schoolPhoto);
        await _appDbContext.SaveChangesAsync(cancellationToken);
      }
      catch
      {
        DeletePhysicalPhotoFile(relativePath);
        throw;
      }

      return ToSchoolPhotoDTO(schoolPhoto, school.Name);
    }

    public async Task<bool> SaveSchoolPhoto(SchoolPhotoDTO photo, CancellationToken cancellationToken)
    {
      var dbPhoto = await _appDbContext.SchoolPhotos.FirstOrDefaultAsync(x => x.Id == photo.Id, cancellationToken);
      if (dbPhoto == null)
      {
        return false;
      }

      dbPhoto.Category = TrimToNull(photo.Category);
      dbPhoto.Caption = TrimToNull(photo.Caption);
      dbPhoto.AltText = TrimToNull(photo.AltText);
      dbPhoto.DisplayOrder = photo.DisplayOrder;
      dbPhoto.IsActive = photo.IsActive;
      dbPhoto.LastUpdated = DateTime.UtcNow;

      await _appDbContext.SaveChangesAsync(cancellationToken);
      return true;
    }

    public async Task<bool> DeleteSchoolPhoto(Guid id, CancellationToken cancellationToken)
    {
      var dbPhoto = await _appDbContext.SchoolPhotos.FirstOrDefaultAsync(x => x.Id == id, cancellationToken);
      if (dbPhoto == null)
      {
        return false;
      }

      _appDbContext.SchoolPhotos.Remove(dbPhoto);
      await _appDbContext.SaveChangesAsync(cancellationToken);
      DeletePhysicalPhotoFile(dbPhoto.FilePath);
      return true;
    }

    public async Task<IList<SchoolDTO>> GetSchools(SchoolFilter filter,CancellationToken cancellationToken)
    {
      var query = _appDbContext.Schools
      .AsNoTracking()
      .Select(x => new SchoolDTO
      {
        Id = x.Id,
        CreatedDate = x.CreatedDate,
        Name = x.Name
      })
      .AsQueryable();

      if (filter?.Name != null)
      {
        query = query.Where(x => x.Name.ToLower().Contains(filter.Name.ToLower()));
      }

      var result = await query.ToListAsync(cancellationToken);
      return result;
    }

    public async Task<IList<SchoolLessonDTO>> GetSchoolLessons(LessonFilter filter,CancellationToken ct)
    {
      var query = _appDbContext.SchoolLessons.AsNoTracking()
        .Include(x => x.School)
        .Include(x => x.Currency)
        .Select(x => new SchoolLessonDTO
        {
          Id = x.Id,
          SchoolId = x.SchoolId,
          Name = x.Name,
          SchoolName = x.School.Name,
          CurrencyCode = x.Currency.CurrencyCode,
          CurrencySymbol = x.Currency.Symbol,
          CurrencyId = x.CurrencyId,
          Description = x.Description,
          Note = x.Note,
          Price = x.Price,
          Week = x.Week,
        }).AsQueryable();

      if(filter?.SchoolId != null)
      {
        query = query.Where(x => x.SchoolId == filter.SchoolId);
      }

      if (filter?.MinPrice != null)
      {
        query = query.Where(x => filter.MinPrice <= x.Price);
      }

      if (filter?.MaxPrice != null)
      {
        query = query.Where(x => x.Price <=  filter.MaxPrice);
      }

      if (filter?.Name != null)
      {
        query = query.Where(x => x.Name.ToLower().Contains(filter.Name.ToLower()));
      }

      if (filter?.Week != null)
      { 
        query = query.Where(x => x.Week == filter.Week);
      }

      var result = await query.ToListAsync(ct);

      return result;
    }

    public async Task<IList<SchoolRoomDTO>> GetSchoolRooms(SchoolRoomFilter filter,CancellationToken cancellationToken)
    {
      var query = _appDbContext.SchoolRooms.AsNoTracking()
        .Include(x => x.School)
        .Include(x => x.Currency)
        .Select(x => new SchoolRoomDTO
        {
          Id = x.Id,
          Name = x.Name,
          CurrencyId = x.CurrencyId,
          CurrencyCode = x.Currency.CurrencyCode,
          CurrencySymbol = x.Currency.Symbol,
          Description = x.Description,
          Price = x.Price,
          SchoolId = x.SchoolId,
          Week = x.Week,
          SchoolName = x.School != null ? x.School.Name : "",
        }).AsQueryable();

      if(filter?.Name != null)
      {
        query = query.Where(x => x.Name.ToLower().Contains(filter.Name.ToLower()));
      }

      if (filter?.SchoolId != null)
      {
        query = query.Where(x => x.SchoolId == filter.SchoolId);
      }

      if (filter?.Week != null)
      { 
        query = query.Where(x => x.Week == filter.Week);
      }

      var result = await query.ToListAsync(cancellationToken);

      return result;
    }

    public async Task<IList<SchoolFeeDTO>> GetSchoolFees(SchoolFeeFilter filter,CancellationToken cancellationToken)
    {
      var query = _appDbContext.SchoolFees.AsNoTracking()
        .Include(x => x.School)
        .Include(x => x.Currency)
        .Select(x => new SchoolFeeDTO
        {
          Id = x.Id,
          Name = x.Name,
          CurrencyId = x.CurrencyId,
          CurrencyCode = x.Currency.CurrencyCode,
          CurrencySymbol = x.Currency.Symbol,
          Description = x.Description,
          Fee = x.Fee,
          LastUpdated = x.LastUpdated,
          SchoolId = x.SchoolId,
          SchoolName = x.School != null ? x.School.Name : "",
        }).AsQueryable();

      if(filter?.Name != null) 
      {
        query = query.Where(x => x.Name.ToLower().Contains(filter.Name.ToLower()));
      }

      if(filter?.MinFee  != null)
      {
        query = query.Where(x => filter.MinFee <= x.Fee);
      }

      if (filter?.MaxFee != null)
      {
        query = query.Where(x => x.Fee <= filter.MaxFee);
      }

      if (filter?.SchoolId != null)
      {
        query = query.Where(x => x.SchoolId == filter.SchoolId);
      }

      var result = await query.ToListAsync(cancellationToken);

      return result;
    }

    public async Task<IList<SchoolNoteDTO>> GetSchoolNotes(SchoolNoteFilter filter,CancellationToken cancellationToken)
    {
      var query = _appDbContext.SchoolNotes.AsNoTracking()
        .Include(x => x.School)
        .Select(x => new SchoolNoteDTO
        {
          Id = x.Id,
          Notes = x.Notes,
          SchoolId = x.SchoolId,
          SchoolName = x.School != null ? x.School.Name : "",
        }).AsQueryable();


      if (filter?.SchoolId != null)
      {
        query = query.Where(x => x.SchoolId == filter.SchoolId);
      }

      if (filter?.Note != null)
      {
        query = query.Where(x => x.Notes.ToLower().Contains(filter.Note.ToLower()));
      }

      var result = await query.ToListAsync(cancellationToken);

      return result;
    }

    public async Task<IList<SchoolPhotoDTO>> GetSchoolPhotos(SchoolPhotoFilter filter, CancellationToken cancellationToken)
    {
      var query = _appDbContext.SchoolPhotos.AsNoTracking()
        .Include(x => x.School)
        .Select(x => new SchoolPhotoDTO
        {
          Id = x.Id,
          SchoolId = x.SchoolId,
          SchoolName = x.School != null ? x.School.Name : "",
          OriginalFileName = x.OriginalFileName,
          StoredFileName = x.StoredFileName,
          Url = x.Url,
          ContentType = x.ContentType,
          SizeBytes = x.SizeBytes,
          Category = x.Category,
          Caption = x.Caption,
          AltText = x.AltText,
          DisplayOrder = x.DisplayOrder,
          IsActive = x.IsActive,
          CreatedAt = x.CreatedAt,
          LastUpdated = x.LastUpdated,
        }).AsQueryable();

      if (filter?.SchoolId != null)
      {
        query = query.Where(x => x.SchoolId == filter.SchoolId);
      }

      if (filter?.SchoolName != null)
      {
        query = query.Where(x => (x.SchoolName ?? "").ToLower().Contains(filter.SchoolName.ToLower()));
      }

      if (filter?.IsActive != null)
      {
        query = query.Where(x => x.IsActive == filter.IsActive);
      }

      var result = await query
        .OrderBy(x => x.DisplayOrder)
        .ThenByDescending(x => x.CreatedAt)
        .ToListAsync(cancellationToken);

      return result;
    }

    private string GetWebRootPath()
    {
      var webRootPath = _environment.WebRootPath;

      if (string.IsNullOrWhiteSpace(webRootPath))
      {
        webRootPath = Path.Combine(_environment.ContentRootPath, "wwwroot");
      }

      Directory.CreateDirectory(webRootPath);
      return webRootPath;
    }

    private void DeletePhysicalPhotoFile(string relativePath)
    {
      if (string.IsNullOrWhiteSpace(relativePath))
      {
        return;
      }

      var webRootPath = Path.GetFullPath(GetWebRootPath())
        .TrimEnd(Path.DirectorySeparatorChar, Path.AltDirectorySeparatorChar);
      var candidatePath = Path.GetFullPath(Path.Combine(webRootPath, relativePath.Replace('/', Path.DirectorySeparatorChar)));

      var isInsideWebRoot =
        candidatePath.Equals(webRootPath, StringComparison.OrdinalIgnoreCase) ||
        candidatePath.StartsWith($"{webRootPath}{Path.DirectorySeparatorChar}", StringComparison.OrdinalIgnoreCase);

      if (!isInsideWebRoot || !System.IO.File.Exists(candidatePath))
      {
        return;
      }

      try
      {
        System.IO.File.Delete(candidatePath);
      }
      catch (IOException)
      {
      }
      catch (UnauthorizedAccessException)
      {
      }
    }

    private static string? TrimToNull(string? value)
    {
      var trimmed = value?.Trim();
      return string.IsNullOrWhiteSpace(trimmed) ? null : trimmed;
    }

    private static SchoolPhotoDTO ToSchoolPhotoDTO(Data.Models.SchoolPhoto photo, string? schoolName)
    {
      return new SchoolPhotoDTO
      {
        Id = photo.Id,
        SchoolId = photo.SchoolId,
        SchoolName = schoolName,
        OriginalFileName = photo.OriginalFileName,
        StoredFileName = photo.StoredFileName,
        Url = photo.Url,
        ContentType = photo.ContentType,
        SizeBytes = photo.SizeBytes,
        Category = photo.Category,
        Caption = photo.Caption,
        AltText = photo.AltText,
        DisplayOrder = photo.DisplayOrder,
        IsActive = photo.IsActive,
        CreatedAt = photo.CreatedAt,
        LastUpdated = photo.LastUpdated,
      };
    }
  }
}
