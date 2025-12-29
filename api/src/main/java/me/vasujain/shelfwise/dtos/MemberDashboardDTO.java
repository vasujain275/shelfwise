package me.vasujain.shelfwise.dtos;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MemberDashboardDTO {

    private long borrowedBooksCount;
    private long overdueBooksCount;
    private List<BookTransactionDTO> overdueBooks;
}
