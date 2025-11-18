package in.dipr.library.mapper;

import in.dipr.library.dtos.BookTransactionDTO;
import in.dipr.library.models.BookTransaction;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

import java.util.List;

@Mapper(componentModel = "spring")
public interface BookTransactionMapper {

    BookTransactionMapper INSTANCE = Mappers.getMapper(BookTransactionMapper.class);

    @Mapping(source = "book.id", target = "bookId")
    @Mapping(source = "user.id", target = "userId")
    @Mapping(source = "book.title", target = "bookTitle")
    @Mapping(source = "book.accessionNumber", target = "accessionNumber")
    @Mapping(source = "user.employeeId", target = "employeeId")
    @Mapping(source = "user.fullName", target = "userFullName")
    @Mapping(source = "issuedBy.id", target = "issuedByUserId")
    @Mapping(source = "issuedBy.fullName", target = "issuedByUserFullName")
    @Mapping(source = "returnedTo.id", target = "returnedToUserId")
    @Mapping(source = "returnedTo.fullName", target = "returnedToUserFullName")
    BookTransactionDTO toDto(BookTransaction transaction);

    List<BookTransactionDTO> toDtoList(List<BookTransaction> transactions);

    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "issuedBy", ignore = true)
    @Mapping(target = "returnedTo", ignore = true)
    @Mapping(source = "bookId", target = "book.id")
    @Mapping(source = "userId", target = "user.id")
    BookTransaction toEntity(BookTransactionDTO transactionDTO);
}
